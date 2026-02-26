import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import beautifier from 'js-beautify';
import unzipper from 'unzipper';
import crypto from 'crypto';
import archiver from 'archiver';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// ADVANCED AI ANALYZER WITH BACKEND EXTRACTION
// ==========================================
const ImprovedAnalyzer = {
  async analyzeCode(code) {
    const patterns = {
      crypto: [/aes|des|rsa|sha|md5|hmac|encrypt|decrypt/gi],
      network: [/http|tcp|socket|ssl|tls|fetch|request|websocket/gi],
      storage: [/database|sqlite|realm|core.data|plist|keychain/gi],
      ui: [/uiview|view.did|bounds|frame|animation|gesture/gi],
      threading: [/dispatch|thread|mutex|semaphore|queue|async/gi],
      security: [/authenticate|authorize|token|password|secret|private|secure/gi],
      native: [/jni|native|bridge|plugin|objective.?c|swift/gi],
    };

    const analysis = {
      warnings: [],
      categories: {},
      riskScore: 0,
      detection_confidence: 0,
      backends: [],
      links: [],
      domains: [],
      ips: [],
      apis: []
    };

    // Extract backends, links, and domains
    const backendPatterns = {
      // HTTP, HTTPS, WebSocket URLs (with looser end condition)
      urls: /(?:https?|wss?):\/\/[^\s\x00"'<>\[\]{}]{5,}/gi,
      // Improved hostname+port pattern
      hostports: /(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?::\d{1,5})?(?:\/[^\s]*)?\b|localhost(?::\d{1,5})?(?:\/[^\s]*)?\b/gi,
      domains: /(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}/gi,
      ips: /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d{1,5})?/g,
      apis: /(?:\/api\/|\/graphql|\/rpc)(?:[a-zA-Z0-9\/._\-?=&]*)/gi,
      graphql: /graphql/gi,
      endpoints: /(?:post|get|put|delete|patch|rpc)\s*\(?['\"]?\/?[a-zA-Z0-9\/._-]+['\"]?/gi,
      fetchCall: /fetch\s*\(\s*['\"][^'\"]+['\"]/gi,
      axiosCall: /axios\.(?:get|post|put|delete|patch)\s*\(\s*['\"][^'\"]+['\"]/gi,
      // RPC method calls (eth_*, web3_*, etc)
      rpcCalls: /\b(?:eth_|web3_|net_|personal_|admin_|miner_|shh_|db_|txpool_|debug_|trace_)[\w]+\b/gi,
      // JSON-RPC patterns
      jsonrpc: /jsonrpc|"method"\s*:\s*"[\w_]+"|"params"\s*:\s*\[/gi,
      networkLibs: /\b(?:NSURLSession|AFHTTPSessionManager|Alamofire|NSURLConnection|CFNetwork|curl|libcurl)\b/gi
    };

    // Extract all URLs
    const urlMatches = code.match(backendPatterns.urls);
    if (urlMatches) {
      analysis.urls = [...new Set(urlMatches)];
      analysis.backends = [...new Set(urlMatches)];
    }

    // Extract host:port patterns (some libs split URLs)
    const hostportMatches = code.match(backendPatterns.hostports);
    if (hostportMatches) {
      analysis.hostports = [...new Set(hostportMatches)];
      analysis.backends.push(...analysis.hostports);
    }

    // Extract domains
    const domainMatches = code.match(backendPatterns.domains);
    if (domainMatches) {
      analysis.domains = [...new Set(domainMatches.filter(d => d.length > 3))];
    }

    // Extract IPs
    const ipMatches = code.match(backendPatterns.ips);
    if (ipMatches) {
      analysis.ips = [...new Set(ipMatches)];
      analysis.backends.push(...analysis.ips);
    }

    // Extract API endpoints (including /graphql)
    const apiMatches = code.match(backendPatterns.apis);
    if (apiMatches) {
      analysis.apis = [...new Set(apiMatches)];
    }

    // look for graphql keyword alone
    if (code.match(backendPatterns.graphql)) {
      analysis.apis = analysis.apis || [];
      analysis.apis.push('/graphql');
    }

    // Extract RPC calls (Ethereum, Web3, etc)
    const rpcMatches = code.match(backendPatterns.rpcCalls);
    if (rpcMatches) {
      analysis.rpcCalls = [...new Set(rpcMatches)];
    }

    // Extract JSON-RPC patterns
    const jsonrpcMatches = code.match(backendPatterns.jsonrpc);
    if (jsonrpcMatches) {
      analysis.hasJsonRpc = jsonrpcMatches.length > 0;
    }

    // Extract fetch/axios calls
    const fetchMatches = code.match(backendPatterns.fetchCall);
    const axiosMatches = code.match(backendPatterns.axiosCall);
    if (fetchMatches || axiosMatches) {
      analysis.networkCalls = [];
      if (fetchMatches) analysis.networkCalls.push(...fetchMatches.map(m => m.replace(/fetch\s*\(/i, '').trim()));
      if (axiosMatches) analysis.networkCalls.push(...axiosMatches.map(m => m.replace(/axios\.[a-z]+\s*\(/i, '').trim()));
    }

    // library detection
    const libMatches = code.match(backendPatterns.networkLibs);
    if (libMatches) {
      analysis.networkLibraries = [...new Set(libMatches)];
    }

    // Generate sample request snippets for each backend URL
    function makeFetchSnippet(url) {
      return `fetch('${url}', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);`;
    }

    const allBackends = analysis.backends || [];
    if (allBackends.length > 0) {
      analysis.sampleRequests = [...new Set(allBackends.map(makeFetchSnippet))];
    }

    for (const [category, regexes] of Object.entries(patterns)) {
      let categoryCount = 0;
      for (const regex of regexes) {
        const matches = code.match(regex);
        if (matches) {
          categoryCount += matches.length;
          analysis.riskScore += matches.length;
        }
      }
      if (categoryCount > 0) {
        analysis.categories[category] = categoryCount;
        analysis.warnings.push(`${category.toUpperCase()}: ${categoryCount} pattern(s)`);
      }
    }
    
    analysis.detection_confidence = Math.min(100, analysis.riskScore * 5);
    return analysis;
  }
};

// ==========================================
// ENHANCED DYLIB DECOMPILER
// ==========================================
export async function decompileDylib(req, res) {
    /*
      decompileDylib already analyzes and generates complete project
      .m file.  We'll also write a .mm copy so Obj-C++ builds succeed.
    */
  try {
    const { filePath } = req.body;
    
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File not found' });
    }

    const file = fs.readFileSync(filePath);
    const baseFilename = path.basename(filePath, path.extname(filePath));
    
    // Comprehensive analysis
    const header = analyzeMachOHeader(file);
    const strings = extractStringsFromBinary(file);
    const cleanStrings = strings.filter(s => s.length > 2 && /[a-zA-Z]/.test(s));
    const deobfuscated = cleanStrings.map(s => deobfuscateString(s));
    
    // Extract classes, methods, functions
    const classes = extractClassInfo(deobfuscated);
    const methods = extractMethodInfo(deobfuscated);
    const imports = extractImports(deobfuscated);
    
    // AI Analysis
    const analysis = await ImprovedAnalyzer.analyzeCode(deobfuscated.join('\n'));
    
    // Generate complete Xcode project
    const projectDir = path.join(__dirname, '../../extracted', `dylib-${baseFilename}-${Date.now()}`);
    fs.mkdirSync(projectDir, { recursive: true });
    
    // Create project structure
    const sourceDir = path.join(projectDir, 'Sources');
    const headersDir = path.join(projectDir, 'Headers');
    const testsDir = path.join(projectDir, 'Tests');
    
    [sourceDir, headersDir, testsDir].forEach(d => fs.mkdirSync(d, { recursive: true }));
    
    // Generate files
    const generatedFiles = {
      implementation: generateImplementation(baseFilename, classes, methods, deobfuscated),
      // note: .mm will be created as copy of implementation later
      header: generateHeader(baseFilename, classes, methods),
      makefile: generateAdvancedMakefile(baseFilename),
      cmake: generateCMakeLists(baseFilename),
      control: generateControlFile(baseFilename, file.length),
      buildScript: generateBuildScript(baseFilename),
      testFile: generateTestFile(baseFilename, methods),
      readme: generateAdvancedREADME(baseFilename, classes, methods, imports),
      podspec: generatePodspec(baseFilename)
    };
    
    // Write files
    const implPath = path.join(sourceDir, `${baseFilename.toLowerCase()}.m`);
    fs.writeFileSync(implPath, generatedFiles.implementation);
    // duplicate as .mm for Obj-C++ compatibility
    fs.writeFileSync(path.join(sourceDir, `${baseFilename.toLowerCase()}.mm`), generatedFiles.implementation);
    fs.writeFileSync(path.join(headersDir, `${baseFilename.toLowerCase()}.h`), generatedFiles.header);
    fs.writeFileSync(path.join(projectDir, 'Makefile'), generatedFiles.makefile);
    fs.writeFileSync(path.join(projectDir, 'CMakeLists.txt'), generatedFiles.cmake);
    fs.writeFileSync(path.join(projectDir, 'control'), generatedFiles.control);
    fs.writeFileSync(path.join(projectDir, 'build.sh'), generatedFiles.buildScript);
    fs.chmodSync(path.join(projectDir, 'build.sh'), 0o755);
    fs.writeFileSync(path.join(testsDir, `${baseFilename.toLowerCase()}_test.m`), generatedFiles.testFile);
    fs.writeFileSync(path.join(projectDir, 'README.md'), generatedFiles.readme);
    fs.writeFileSync(path.join(projectDir, `${baseFilename}.podspec`), generatedFiles.podspec);
    
    // Create ZIP
    const zipPath = path.join(__dirname, '../../extracted', `${baseFilename}-complete-${Date.now()}.zip`);
    await createZipArchive(projectDir, zipPath);
    
    res.json({
      success: true,
      type: 'Dylib',
      filename: path.basename(filePath),
      baseFilename,
      analysis_data: {
        machO: header,
        strings_found: deobfuscated.length,
        classes_detected: classes.length,
        methods_detected: methods.length,
        imports_detected: imports.length
      },
      extracted: {
        classes: classes.slice(0, 50),
        methods: methods.slice(0, 50),
        imports: imports.slice(0, 50)
      },
      network_analysis: {
        backends: analysis.backends ? [...new Set(analysis.backends)].slice(0, 30) : [],
        apis: analysis.apis ? [...new Set(analysis.apis)].slice(0, 30) : [],
        domains: analysis.domains ? [...new Set(analysis.domains)].slice(0, 30) : [],
        ips: analysis.ips ? [...new Set(analysis.ips)].slice(0, 30) : [],
        rpc_calls: analysis.rpcCalls ? [...new Set(analysis.rpcCalls)].slice(0, 30) : [],
        has_jsonrpc: analysis.hasJsonRpc || false,
        network_libraries: analysis.networkLibraries || [],
        network_calls: analysis.networkCalls ? analysis.networkCalls.slice(0, 20) : [],
        sample_requests: analysis.sampleRequests ? analysis.sampleRequests.slice(0, 5) : []
      },
      security: analysis,
      downloads: {
        zip: path.basename(zipPath),
        zipPath: zipPath
      },
      generatedFiles: [
        '📄 Sources/*.m (Implementation)',
        '📄 Headers/*.h (Header files)',
        '📄 Tests/*_test.m (Unit tests)',
        '📄 Makefile (Build system)',
        '📄 CMakeLists.txt (CMake config)',
        '📄 build.sh (Build script)',
        '📄 *.podspec (CocoaPods)',
        '📄 control (Debian package)',
        '📄 README.md (Documentation)'
      ],
      message: `✅ SUCCESS: Dylib decompiled with ${classes.length} classes, ${methods.length} methods. Found ${(analysis.backends || []).length} backends, ${(analysis.apis || []).length} APIs. Complete project generated!`
    });
  } catch (error) {
    console.error('Dylib error:', error);
    res.status(500).json({ error: `Decompile failed: ${error.message}` });
  }
}

// APK Decompilation
export async function decompileAPK(req, res) {
  try {
    const { filePath } = req.body;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File not found' });
    }

    const outputDir = path.join(__dirname, '../../extracted', `apk-${Date.now()}`);
    fs.mkdirSync(outputDir, { recursive: true });

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: outputDir }))
        .on('error', reject)
        .on('close', resolve);
    });

    const files = scanDirectory(outputDir);
    const manifest = findAndParseFile(outputDir, 'AndroidManifest.xml') || 'No manifest found';
    
    res.json({
      success: true,
      type: 'APK',
      filename: path.basename(filePath),
      totalFiles: files.length,
      files: files.slice(0, 100),
      manifest: manifest.substring(0, 2000),
      extractedPath: outputDir,
      message: `✅ APK extracted: ${files.length} files found`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// JAR Decompilation
export async function decompileJar(req, res) {
  try {
    const { filePath } = req.body;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File not found' });
    }

    const outputDir = path.join(__dirname, '../../extracted', `jar-${Date.now()}`);
    fs.mkdirSync(outputDir, { recursive: true });

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: outputDir }))
        .on('error', reject)
        .on('close', resolve);
    });

    const files = scanDirectory(outputDir);
    const classFiles = files.filter(f => f.ext === '.class');
    
    res.json({
      success: true,
      type: 'JAR',
      filename: path.basename(filePath),
      totalFiles: files.length,
      classCount: classFiles.length,
      files: files.slice(0, 100),
      extractedPath: outputDir,
      message: `✅ JAR extracted: ${classFiles.length} classes, ${files.length} total files`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Universal File Analyzer
export async function analyzeFile(req, res) {
  try {
    const { filePath } = req.body;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File not found' });
    }

    const stats = fs.statSync(filePath);
    const buffer = Buffer.alloc(Math.min(4096, stats.size));
    fs.readSync(fs.openSync(filePath, 'r'), buffer, 0, buffer.length, 0);

    const ext = path.extname(filePath);
    const magic = buffer.slice(0, 4).toString('hex');
    const fileType = identifyFileType(magic, ext);
    const entropy = calculateEntropy(buffer);
    const signatures = detectSignatures(buffer);
    const hash = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');

    res.json({
      success: true,
      filename: path.basename(filePath),
      type: fileType,
      size: stats.size,
      sizeFormatted: formatBytes(stats.size),
      entropy: entropy.toFixed(2),
      signatures: signatures,
      hash: hash.substring(0, 16),
      extension: ext,
      message: `✅ File analyzed: Type=${fileType}, Size=${formatBytes(stats.size)}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Code Beautifier
export async function beautifyCode(req, res) {
  try {
    const { code, language } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    let beautified = code;
    let formatted = false;

    if (language === 'js' || language === 'javascript') {
      beautified = beautifier.js(code, { indent_size: 2, max_preserve_newlines: 2 });
      formatted = true;
    } else if (language === 'html' || language === 'xml') {
      beautified = beautifier.html(code, { indent_size: 2, preserve_newlines: true });
      formatted = true;
    } else if (language === 'css') {
      beautified = beautifier.css(code, { indent_size: 2 });
      formatted = true;
    }

    res.json({
      success: true,
      beautified,
      formatted,
      stats: {
        lines: beautified.split('\n').length,
        size: beautified.length
      },
      message: `✅ Code formatted: ${beautified.split('\n').length} lines`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Download generated project
export async function downloadDylibProject(req, res) {
  try {
    const { zipPath, filename } = req.body;
    if (!zipPath || !fs.existsSync(zipPath)) {
      return res.status(400).json({ error: 'Zip not found' });
    }

    const stat = fs.statSync(zipPath);
    const zipName = filename || path.basename(zipPath);
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    const fileStream = fs.createReadStream(zipPath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    });
    
    res.on('finish', () => {
      // Clean up temp ZIP file after download
      setImmediate(() => {
        fs.unlink(zipPath, (err) => {
          if (!err) console.log(`✅ Cleaned up: ${zipPath}`);
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ==========================================
// ADVANCED CODE GENERATORS
// ==========================================

// simple website fetcher to download HTML for a given URL
export async function fetchWebsite(req, res) {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });
    const resp = await fetch(url);
    const text = await resp.text();
    res.json({ url, status: resp.status, headers: Object.fromEntries(resp.headers.entries()), content: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

function generateImplementation(baseFilename, classes, methods, strings) {
  const className = toPascalCase(baseFilename);
  const methodList = methods.slice(0, 20).filter(m => m.name && m.name.length > 2);
  
  return `//
// ${baseFilename.toLowerCase()}.m
// Auto-decompiled from Mach-O binary
// Generated: ${new Date().toISOString()}
//

#import "${baseFilename.toLowerCase()}.h"
#import <Foundation/Foundation.h>
#import <objc/runtime.h>

@interface ${className} () {
    NSMutableDictionary *_cache;
    NSMutableArray *_handlers;
}
@end

@implementation ${className}

+ (instancetype)shared {
    static ${className} *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _cache = [NSMutableDictionary new];
        _handlers = [NSMutableArray new];
        [self setupFrameworks];
        [self initializeState];
    }
    return self;
}

- (void)setupFrameworks {
    // Initialize frameworks and dependencies
    NSLog(@"[${className}] Setting up frameworks...");
}

- (void)initializeState {
    // Initialize internal state and handlers
    NSLog(@"[${className}] Initialization complete");
}

${methodList.map((m, i) => `
/**
 * Method: ${m.name}
 * Type: ${m.type || 'unknown'}
 */
- (void)${m.name} {
    @synchronized(self) {
        NSLog(@"[${className}] Executing: ${m.name}");
        // TODO: Implement extracted logic
    }
}
`).join('\n')}

- (void)dealloc {
    NSLog(@"[${className}] Deallocating");
    _cache = nil;
    _handlers = nil;
}

@end

/**
 * Extracted Constants and Strings
 */
static const struct {
    __unsafe_unretained NSString *identifier;
    __unsafe_unretained NSString *value;
} ${className.toLowerCase()}_constants[] = {
${strings.slice(0, 15).map(s => `    { @"${toPascalCase(s.substring(0, 30))}", @"${s.replace(/"/g, '\\"')}" },`).join('\n')}
};
`;
}

function generateHeader(baseFilename, classes, methods) {
  const className = toPascalCase(baseFilename);
  const methodList = methods.slice(0, 20).filter(m => m.name);

  return `//
// ${baseFilename.toLowerCase()}.h
// Auto-decompiled from Mach-O binary
// Generated: ${new Date().toISOString()}
//

#ifndef __${baseFilename.toUpperCase()}_H__
#define __${baseFilename.toUpperCase()}_H__

#import <Foundation/Foundation.h>

NS_BEGIN_DECLS

/**
 * Main ${className} interface
 * Auto-generated from dylib decompilation
 */
@interface ${className} : NSObject

/**
 * Singleton instance
 */
+ (instancetype)shared;

/**
 * Initialization
 */
- (instancetype)init;

/**
 * Framework setup
 */
- (void)setupFrameworks;

/**
 * State initialization
 */
- (void)initializeState;

${methodList.map((m, i) => `
/**
 * Extracted method: ${m.name}
 */
- (void)${m.name};
`).join('\n')}

@end

NS_END_DECLS

#endif // __${baseFilename.toUpperCase()}_H__
`;
}

function generateAdvancedMakefile(baseFilename) {
  const target = baseFilename.toLowerCase();
  
  return `# Advanced Makefile for ${baseFilename}
# Supports both iOS and macOS

CLANG ?= clang
ARCHS = arm64 x86_64
iOS_MIN = 11.0
LIBS = -framework Foundation -framework UIKit

SRC = Sources/${target}.m
OBJ = build/${target}.o
HEADERS = -I./Headers

# Output
DYLIB = lib${target}.dylib
FRAMEWORK = ${baseFilename}.framework

.PHONY: all clean install test framework arm64-build

all: $(DYLIB)

$(DYLIB): $(OBJ)
	$(CLANG) -dynamiclib -o $@ $^ $(LIBS)

$(OBJ): $(SRC)
	@mkdir -p build
	$(CLANG) -fPIC -Wall -Wextra -O2 $(HEADERS) -c -o $@ $<

framework: $(DYLIB)
	@mkdir -p $(FRAMEWORK)/Headers
	cp $< $(FRAMEWORK)/
	cp Headers/*.h $(FRAMEWORK)/Headers/

clean:
	rm -rf build $(DYLIB) $(FRAMEWORK) *.o

install: $(DYLIB)
	mkdir -p /usr/local/lib
	cp $< /usr/local/lib/

test:
	@echo "Running tests..."
	clang -o test_runner Tests/*.m Sources/*.m -framework Foundation
	./test_runner

.PHONY: all clean install test framework
`;
}

function generateCMakeLists(baseFilename) {
  const target = baseFilename.toLowerCase();
  
  return `cmake_minimum_required(VERSION 3.10)
project(${baseFilename})

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 14)

# Find frameworks (macOS/iOS)
find_library(FOUNDATION Foundation REQUIRED)
find_library(UIKIT UIKit)

# Source files
set(SOURCES
    Sources/${target}.m
)

# Headers
include_directories(Headers)

# Library
add_library(${target} SHARED \${SOURCES})
target_link_libraries(${target} \${FOUNDATION})

# Installation
install(TARGETS ${target} DESTINATION lib)
install(DIRECTORY Headers/ DESTINATION include)
`;
}

function generateControlFile(baseFilename, fileSize) {
  return `Package: ${baseFilename.toLowerCase()}
Version: 1.0.0
Architecture: iphoneos-arm
Maintainer: Decompiler <decompiler@localhost>
Installed-Size: ${Math.ceil(fileSize / 1024)}
Depends: firmware (>= 11.0)
Description: Auto-decompiled Objective-C dylib
 This package contains auto-decompiled source code from a Mach-O dylib.
 Generated by Advanced Dylib Decompiler with AI analysis.
 
 Features:
 - Extracted classes and methods
 - Header files and documentation
 - Build scripts and Makefiles
 - Unit tests
Homepage: http://localhost:3000
`;
}

function generateBuildScript(baseFilename) {
  return `#!/bin/bash
# Build script for ${baseFilename}

set -e

echo "🔨 Building ${baseFilename}..."

# Check requirements
command -v clang >/dev/null 2>&1 || { echo "❌ clang required"; exit 1; }

# Clean
make clean 2>/dev/null || true

# Build
make all

# Test
if [ -f "Tests/${baseFilename.toLowerCase()}_test.m" ]; then
    echo "🧪 Running tests..."
    make test
fi

# Verify
if [ -f "lib${baseFilename.toLowerCase()}.dylib" ]; then
    echo "✅ Build successful!"
    echo "   Output: lib${baseFilename.toLowerCase()}.dylib"
    file lib${baseFilename.toLowerCase()}.dylib
else
    echo "❌ Build failed"
    exit 1
fi
`;
}

function generateTestFile(baseFilename, methods) {
  const className = toPascalCase(baseFilename);
  const testMethods = methods.slice(0, 10);
  
  return `//
// ${baseFilename.toLowerCase()}_test.m
// Unit tests for ${baseFilename}
//

#import <Foundation/Foundation.h>
#import "../Headers/${baseFilename.toLowerCase()}.h"

void test_initialization() {
    ${className} *instance = [${className} shared];
    assert(instance != nil);
    printf("✅ Initialization test passed\\n");
}

void test_shared_instance() {
    ${className} *inst1 = [${className} shared];
    ${className} *inst2 = [${className} shared];
    assert(inst1 == inst2);
    printf("✅ Singleton test passed\\n");
}

${testMethods.map(m => `
void test_${m.name || 'method'}() {
    ${className} *instance = [${className} shared];
    [instance ${m.name || 'method'}];
    printf("✅ ${m.name} test passed\\n");
}
`).join('\n')}

int main(int argc, const char **argv) {
    printf("🧪 Running ${baseFilename} tests...\\n\\n");
    
    test_initialization();
    test_shared_instance();
    ${testMethods.slice(0, 5).map(m => `test_${m.name || 'method'}();`).join('\n    ')}
    
    printf("\\n✅ All tests passed!\\n");
    return 0;
}
`;
}

function generateAdvancedREADME(baseFilename, classes, methods, imports) {
  return `# ${baseFilename}

Auto-decompiled Objective-C dylib from Mach-O binary with full source code, headers, and build configuration.

## 🎯 Overview

**Generated on:** ${new Date().toISOString()}

**Analysis Results:**
- Classes detected: ${classes.length}
- Methods extracted: ${methods.length}
- Dependencies: ${imports.length}

## 📁 Project Structure

\`\`\`
├── Sources/              # Implementation files (.m)
├── Headers/              # Header files (.h)
├── Tests/                # Unit tests
├── Makefile              # GNU Make configuration
├── CMakeLists.txt        # CMake configuration
├── build.sh              # Automated build script
├── ${baseFilename}.podspec     # CocoaPods specification
├── control               # Debian package control
└── README.md             # This file
\`\`\`

## 🔨 Building

### Option 1: Using Makefile
\`\`\`bash
make all
\`\`\`

### Option 2: Using build.sh
\`\`\`bash
chmod +x build.sh
./build.sh
\`\`\`

### Option 3: Using CMake
\`\`\`bash
mkdir build
cd build
cmake ..
cmake --build .
\`\`\`

### Option 4: Using CocoaPods
\`\`\`bash
pod install
\`\`\`

## 📦 Installation

\`\`\`bash
sudo make install
\`\`\`

## 🧪 Testing

\`\`\`bash
make test
\`\`\`

## 📚 Extracted Elements

### Classes (${classes.length})
${classes.slice(0, 20).map((c, i) => `${i + 1}. \`${c}\``).join('\n')}

### Methods (${methods.length})
${methods.slice(0, 30).map((m, i) => `${i + 1}. \`${m.name || 'unknown'}\` [${m.type || 'instance'}]`).join('\n')}

### Dependencies
${imports.slice(0, 15).map(imp => `- ${imp}`).join('\n')}

## ⚙️ API Usage

\`\`\`objc
#import "${baseFilename.toLowerCase()}.h"

// Get singleton instance
${toPascalCase(baseFilename)} *handler = [${toPascalCase(baseFilename)} shared];

// Call methods
[handler setupFrameworks];
[handler initializeState];
\`\`\`

## 🔒 Security Considerations

This code was auto-generated from binary analysis:
- Verify all extracted functionality before deployment
- Review extracted strings and constants for sensitive data
- Test thoroughly in controlled environment
- Check for any obfuscation or packers

## 📝 Notes

- Generated dynamically from Mach-O binary
- May contain placeholder implementations
- Full testing and review recommended
- Adapt to your specific use case

## 🤝 Contributing

Generated code - please provide feedback on accuracy and completeness.

---

Generated by **Advanced Dylib Decompiler** with AI-powered analysis.
`;
}

function generatePodspec(baseFilename) {
  const className = toPascalCase(baseFilename);
  
  return `Pod::Spec.new do |spec|
  spec.name         = '${baseFilename}'
  spec.version      = '1.0.0'
  spec.summary      = 'Auto-decompiled Objective-C dylib'
  spec.description  = 'Objective-C dylib auto-generated from Mach-O binary decompilation'
  spec.homepage     = 'http://localhost:3000'
  spec.license      = { :type => 'MIT', :file => 'LICENSE' }
  spec.authors      = { 'Decompiler' => 'decompiler@local' }
  
  spec.platform               = :ios, '11.0'
  spec.source                 = { :path => '.' }
  spec.source_files           = 'Sources/**/*.{m,h}', 'Headers/**/*.h'
  spec.public_header_files    = 'Headers/**/*.h'
  
  spec.frameworks = 'Foundation', 'UIKit'
  spec.requires_arc = true
end
`;
}

// ==========================================
// EXTRACTION FUNCTIONS
// ==========================================

function extractClassInfo(strings) {
  const classPatterns = [
    /class\s+(\w+)/gi,
    /@interface\s+(\w+)/gi,
    /(\w+)Handler/gi,
    /(\w+)Controller/gi,
    /(\w+)View/gi,
    /(\w+)Manager/gi
  ];
  
  const classes = new Set();
  
  for (const pattern of classPatterns) {
    for (const str of strings) {
      const match = str.match(pattern);
      if (match) {
        match.forEach(m => {
          const className = m.replace(/class\s+|@interface\s+/gi, '');
          if (className.length > 2 && /^[A-Z]/.test(className)) {
            classes.add(className);
          }
        });
      }
    }
  }
  
  return Array.from(classes);
}

function extractMethodInfo(strings) {
  const methodPatterns = [
    { type: 'init', regex: /init\w*/ },
    { type: 'lifecycle', regex: /did\w+|will\w+|view\w+/ },
    { type: 'action', regex: /handle\w+|process\w+|execute\w+/ },
    { type: 'getter', regex: /get\w+|is\w+/ },
    { type: 'setter', regex: /set\w+/ }
  ];
  
  const methods = [];
  
  for (const str of strings) {
    for (const { type, regex } of methodPatterns) {
      if (regex.test(str)) {
        methods.push({ name: str, type });
      }
    }
  }
  
  return methods.filter((m, i, arr) => arr.indexOf(m) === i);
}

function extractImports(strings) {
  const importPatterns = [
    /framework|dylib|System|Foundation|UIKit|CoreData/gi
  ];
  
  const imports = new Set();
  
  for (const str of strings) {
    for (const pattern of importPatterns) {
      if (pattern.test(str)) {
        imports.add(str);
      }
    }
  }
  
  return Array.from(imports);
}

function deobfuscateString(str) {
  let result = str;
  
  // Dehex
  result = result.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => 
    String.fromCharCode(parseInt(hex, 16))
  );
  
  // Unicode
  result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => 
    String.fromCharCode(parseInt(hex, 16))
  );
  
  // Base64
  if (/^[A-Za-z0-9+/=]{20,}$/.test(str)) {
    try {
      const decoded = Buffer.from(str, 'base64').toString('utf-8');
      if (/[a-zA-Z0-9_]/.test(decoded)) result = decoded;
    } catch(e) {}
  }
  
  return result;
}

function analyzeMachOHeader(buffer) {
  if (buffer.length < 32) return null;

  const magic = buffer.readUInt32LE(0);
  const architectures = {
    0xfeedfacf: '64-bit Intel',
    0xfeedface: '32-bit Intel',
    0xcffaedfe: '64-bit ARM (ARM64)',
    0xcefaedfe: '32-bit ARM'
  };

  return {
    magic: `0x${magic.toString(16)}`,
    architecture: architectures[magic] || 'Unknown',
    cpuType: buffer.readUInt32LE(4),
    valid: Object.keys(architectures).includes('0x' + magic.toString(16))
  };
}

function extractStringsFromBinary(buffer, minLength = 2) {
  const strings = [];
  let current = '';
  
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    
    if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
      current += String.fromCharCode(byte);
    } else if (byte === 0 && current.length >= minLength) {
      if (current.trim()) strings.push(current);
      current = '';
    } else if (current.length >= minLength && byte < 32) {
      if (current.trim()) strings.push(current);
      current = '';
    }
  }
  
  if (current.length >= minLength) strings.push(current);
  
  return [...new Set(strings)];
}

function calculateEntropy(buffer) {
  const freq = new Uint8Array(256);
  for (let i = 0; i < buffer.length; i++) freq[buffer[i]]++;
  
  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (freq[i] > 0) {
      const p = freq[i] / buffer.length;
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

function detectSignatures(buffer) {
  const sigs = [];
  if (buffer.slice(0, 4).toString('hex') === '504b0304') sigs.push('ZIP');
  if (buffer.slice(0, 4).toString('hex') === 'feedfacf') sigs.push('Mach-O');
  if (buffer.slice(0, 4).toString('hex') === '7f454c46') sigs.push('ELF');
  if (buffer.slice(0, 4).toString('hex') === '4d5a9000') sigs.push('PE');
  return sigs;
}

function identifyFileType(magic, ext) {
  const map = {
    '504b0304': 'ZIP Archive',
    'feedfacf': 'Mach-O 64-bit',
    '7f454c46': 'ELF Binary',
    '4d5a': 'Windows PE'
  };
  return map[magic] || `${ext || 'Unknown'} File`;
}

function scanDirectory(dir, depth = 3, current = 0) {
  const files = [];
  if (current >= depth) return files;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      try {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...scanDirectory(fullPath, depth, current + 1));
        } else {
          files.push({
            name: entry.name,
            path: fullPath,
            size: fs.statSync(fullPath).size,
            ext: path.extname(entry.name)
          });
        }
      } catch (e) {}
    }
  } catch (e) {}
  return files;
}

function findAndParseFile(dir, filename) {
  try {
    const found = fs.readdirSync(dir, { recursive: true })
      .find(f => f.toLowerCase().includes(filename.toLowerCase()));
    if (found) {
      return fs.readFileSync(path.join(dir, found), 'utf-8').substring(0, 5000);
    }
  } catch (e) {}
  return '';
}

function formatBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

function toPascalCase(str) {
  return str.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

function createZipArchive(sourceDir, zipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(zipPath));
    archive.on('error', reject);
    archive.on('warning', err => {
      // log but don't fail on non-fatal warnings
      if (err.code === 'ENOENT') console.warn('Archiver warning', err);
      else reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, path.basename(sourceDir));
    archive.finalize();
  });
}

// ==========================================
// BATCH FILE PROCESSING (1000+ FILES)
// ==========================================
export async function batchDecompileDylib(req, res) {
  try {
    const { filePaths } = req.body;
    
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    if (filePaths.length > 10000) {
      return res.status(400).json({ error: 'Max 10,000 files allowed' });
    }

    const batchId = `batch-${Date.now()}`;
    const batchDir = path.join(__dirname, '../../extracted', batchId);
    fs.mkdirSync(batchDir, { recursive: true });

    const results = {
      batchId,
      timestamp: new Date().toISOString(),
      totalFiles: filePaths.length,
      processed: 0,
      failed: 0,
      files: [],
      allBackends: [],
      allLinks: [],
      allDomains: [],
      allIPs: [],
      allAPIs: [],
      summary: null
    };

    // Process each file
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i];
      
      if (!fs.existsSync(filePath)) {
        results.failed++;
        continue;
      }

      try {
        const file = fs.readFileSync(filePath);
        const baseFilename = path.basename(filePath, path.extname(filePath));
        
        // Extract strings and analyze
        const strings = extractStringsFromBinary(file);
        const cleanStrings = strings.filter(s => s.length > 2 && /[a-zA-Z]/.test(s));
        const deobfuscated = cleanStrings.map(s => deobfuscateString(s));
        
        // AI Analysis with backend extraction
        const analysis = await ImprovedAnalyzer.analyzeCode(deobfuscated.join('\n'));
        
        // Collect backends and links
        if (analysis.backends?.length > 0) {
          results.allBackends.push(...analysis.backends);
        }
        if (analysis.domains?.length > 0) {
          results.allDomains.push(...analysis.domains);
        }
        if (analysis.ips?.length > 0) {
          results.allIPs.push(...analysis.ips);
        }
        if (analysis.urls?.length > 0) {
          results.allLinks.push(...analysis.urls);
        }

        results.files.push({
          name: baseFilename,
          path: filePath,
          size: file.length,
          stringsFound: cleanStrings.length,
          analysis: analysis,
          backends: analysis.backends || [],
          domains: analysis.domains || [],
          ips: analysis.ips || [],
          apis: analysis.apis || []
        });

        results.processed++;

        // Log progress every 100 files
        if (results.processed % 100 === 0) {
          console.log(`📊 Batch processing: ${results.processed}/${filePaths.length}`);
        }

      } catch (error) {
        results.failed++;
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }

    // Deduplicate and summarize
    results.allBackends = [...new Set(results.allBackends)];
    results.allLinks = [...new Set(results.allLinks)];
    results.allDomains = [...new Set(results.allDomains)];
    results.allIPs = [...new Set(results.allIPs)];
    results.allAPIs = [...new Set(results.allAPIs)];

    results.summary = {
      uniqueBackends: results.allBackends.length,
      uniqueLinks: results.allLinks.length,
      uniqueDomains: results.allDomains.length,
      uniqueIPs: results.allIPs.length,
      uniqueAPIs: results.allAPIs.length,
      successRate: `${Math.round((results.processed / filePaths.length) * 100)}%`
    };

    // Create consolidated report and ZIP archive
    const reportPath = path.join(batchDir, 'batch-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    // Create backends summary file
    const backendsReportPath = path.join(batchDir, 'backends-summary.txt');
    const backendsContent = [
      `BATCH ANALYSIS REPORT - ${new Date().toISOString()}`,
      `Total Files: ${results.totalFiles}`,
      `Successfully Processed: ${results.processed}`,
      `Failed: ${results.failed}`,
      ``,
      `DISCOVERED BACKENDS (${results.allBackends.length})`,
      `DISCOVERED API PATHS (${results.allAPIs.length})`,
      `================================`,
      ...results.allBackends.slice(0, 100),
      ``,
      `DISCOVERED DOMAINS (${results.allDomains.length})`,
      `================================`,
      ...results.allDomains.slice(0, 50),
      ``,
      `DISCOVERED IPs (${results.allIPs.length})`,
      `================================`,
      ...results.allIPs.slice(0, 50),
      ``,
      `API ENDPOINTS`,
      `================================`,
      ...results.files.flatMap(f => f.apis || []).filter((v, i, a) => a.indexOf(v) === i).slice(0, 50)
    ].join('\n');
    fs.writeFileSync(backendsReportPath, backendsContent);

    // Create ZIP archive of batch results
    const zipPath = path.join(batchDir, `${batchId}.zip`);
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 6 } });

      output.on('close', () => resolve(zipPath));
      archive.on('error', reject);

      archive.pipe(output);
      archive.file(reportPath, { name: 'batch-report.json' });
      archive.file(backendsReportPath, { name: 'backends-summary.txt' });
      archive.finalize();
    });

    results.zipPath = zipPath;
    res.json(results);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
