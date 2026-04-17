const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const appPath = 'release/mac-arm64/Image Optimizer.app';
const resourcesPath = path.join(appPath, 'Contents/Resources');
const frameworksPath = path.join(appPath, 'Contents/Frameworks');

const appAsarUnpacked = path.join(resourcesPath, 'app.asar.unpacked');
const sharpNodePath = path.join(appAsarUnpacked, 'node_modules/@img/sharp-darwin-arm64/lib/sharp-darwin-arm64.node');
const libvipsPath = path.join(appAsarUnpacked, 'node_modules/@img/sharp-libvips-darwin-arm64/lib/libvips-cpp.42.dylib');

const LIBVIPS_INSTALL_NAME = '@executable_path/../Frameworks/libvips-cpp.42.dylib';

console.log('Fixing Sharp native module paths...');

try {
  if (!fs.existsSync(sharpNodePath)) {
    console.error('❌ sharp.node not found at:', sharpNodePath);
    process.exit(1);
  }

  if (!fs.existsSync(libvipsPath)) {
    console.error('❌ libvips not found at:', libvipsPath);
    process.exit(1);
  }

  const libvipsFrameworkPath = path.join(frameworksPath, 'libvips-cpp.42.dylib');
  
  if (!fs.existsSync(frameworksPath)) {
    fs.mkdirSync(frameworksPath, { recursive: true });
  }
  
  fs.copyFileSync(libvipsPath, libvipsFrameworkPath);
  console.log('✓ Copied libvips to Frameworks');

  execSync(`install_name_tool -id "${LIBVIPS_INSTALL_NAME}" "${libvipsFrameworkPath}"`, { stdio: 'inherit' });
  console.log('✓ Updated libvips install name to', LIBVIPS_INSTALL_NAME);

  const possibleOldNames = [
    '@rpath/libvips-cpp.42.dylib',
    '@loader_path/../../../../../../Frameworks/libvips-cpp.42.dylib'
  ];

  const binariesToFix = [sharpNodePath];

  for (const binaryPath of binariesToFix) {
    for (const oldName of possibleOldNames) {
      try {
        execSync(`install_name_tool -change "${oldName}" "${LIBVIPS_INSTALL_NAME}" "${binaryPath}"`, { stdio: 'pipe' });
        console.log('✓ Updated', path.basename(binaryPath), 'reference:', oldName, '→', LIBVIPS_INSTALL_NAME);
      } catch {
        // reference not found, skip
      }
    }
  }

  const asarPath = path.join(resourcesPath, 'app.asar');
  const tmpExtractDir = path.join(resourcesPath, '_asar_tmp');
  
  if (fs.existsSync(asarPath)) {
    console.log('\n📦 Patching asar archive...');
    
    try {
      execSync(`npx asar extract "${asarPath}" "${tmpExtractDir}"`, { stdio: 'pipe' });
      
      const asarSharpNode = path.join(tmpExtractDir, 'node_modules/@img/sharp-darwin-arm64/lib/sharp-darwin-arm64.node');
      
      if (fs.existsSync(asarSharpNode)) {
        for (const oldName of possibleOldNames) {
          try {
            execSync(`install_name_tool -change "${oldName}" "${LIBVIPS_INSTALL_NAME}" "${asarSharpNode}"`, { stdio: 'pipe' });
            console.log('✓ Updated asar sharp.node reference:', oldName, '→', LIBVIPS_INSTALL_NAME);
          } catch {
            // reference not found, skip
          }
        }
      }
      
      const asarLibvips = path.join(tmpExtractDir, 'node_modules/@img/sharp-libvips-darwin-arm64/lib/libvips-cpp.42.dylib');
      if (fs.existsSync(asarLibvips)) {
        try {
          execSync(`install_name_tool -id "${LIBVIPS_INSTALL_NAME}" "${asarLibvips}"`, { stdio: 'pipe' });
          console.log('✓ Updated asar libvips install name');
        } catch {
          // skip
        }
      }
      
      fs.unlinkSync(asarPath);
      execSync(`npx asar pack "${tmpExtractDir}" "${asarPath}"`, { stdio: 'pipe' });
      console.log('✓ Repacked asar archive');
      
      fs.rmSync(tmpExtractDir, { recursive: true, force: true });
      console.log('✓ Cleaned up temp files');
    } catch (asarError) {
      console.warn('⚠️  Asar patching failed (non-critical):', asarError.message);
      if (fs.existsSync(tmpExtractDir)) {
        fs.rmSync(tmpExtractDir, { recursive: true, force: true });
      }
    }
  }

  console.log('\n✅ Sharp native module paths fixed successfully!');
} catch (error) {
  console.error('❌ Error fixing paths:', error.message);
  process.exit(1);
}
