import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Binary Analysis Utilities
 */

export class BinaryAnalyzer {
  /**
   * Analyze file signature/magic bytes
   */
  static identifyFileType(buffer) {
    const signatures = {
      '504b0304': { name: 'ZIP/APK/JAR', type: 'archive', handler: 'unpack' },
      '7f454c46': { name: 'ELF Binary', type: 'executable', handler: 'elf' },
      'fffb': { name: 'MP3 Audio', type: 'audio', handler: 'skip' },
      'ffd8ffe0': { name: 'JPEG Image', type: 'image', handler: 'skip' },
      '89504e47': { name: 'PNG Image', type: 'image', handler: 'skip' },
      '47494638': { name: 'GIF Image', type: 'image', handler: 'skip' },
      '25504446': { name: 'PDF Document', type: 'document', handler: 'extract' },
      'cafebabe': { name: 'Java Class', type: 'executable', handler: 'analyze' },
      'feedfacf': { name: 'Mach-O 64-bit', type: 'executable', handler: 'mach' },
      'feedface': { name: 'Mach-O 32-bit', type: 'executable', handler: 'mach' },
      'cefaedfe': { name: 'Mach-O 64-bit (LE)', type: 'executable', handler: 'mach' },
      'cefaedfe': { name: 'Mach-O 32-bit (LE)', type: 'executable', handler: 'mach' },
      '1f8b08': { name: 'GZIP Compressed', type: 'compressed', handler: 'gzip' },
      '526172': { name: 'RAR Archive', type: 'archive', handler: 'unpack' },
      '42':     { name: 'Bzip2 Archive', type: 'archive', handler: 'bzip' }
    };

    const hexHeader = buffer.slice(0, 4).toString('hex').toLowerCase();
    
    for (const [sig, info] of Object.entries(signatures)) {
      if (hexHeader.startsWith(sig)) {
        return info;
      }
    }
    
    return { name: 'Unknown', type: 'unknown', handler: 'analyze' };
  }

  /**
   * Extract strings from binary file
   */
  static extractStrings(buffer, minLength = 4) {
    const strings = [];
    let currentString = '';
    
    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];
      
      // Printable ASCII characters
      if (byte >= 32 && byte <= 126) {
        currentString += String.fromCharCode(byte);
      } else {
        if (currentString.length >= minLength) {
          strings.push(currentString);
        }
        currentString = '';
      }
    }
    
    if (currentString.length >= minLength) {
      strings.push(currentString);
    }
    
    return strings;
  }

  /**
   * Analyze ELF binary header
   */
  static analyzeELFHeader(buffer) {
    if (buffer.length < 64) return null;

    const elfHeader = {
      class: buffer[4] === 1 ? '32-bit' : buffer[4] === 2 ? '64-bit' : 'unknown',
      data: buffer[5] === 1 ? 'Little-endian' : buffer[5] === 2 ? 'Big-endian' : 'unknown',
      osABI: buffer[7],
      type: buffer.readUInt16LE(16),
      machine: buffer.readUInt16LE(18),
      version: buffer.readUInt32LE(20),
      entryPoint: buffer.readUInt32LE(28)
    };

    return elfHeader;
  }

  /**
   * Calculate file entropy (for compressed detection)
   */
  static calculateEntropy(buffer, sampleSize = 10000) {
    const sample = buffer.slice(0, Math.min(sampleSize, buffer.length));
    const frequency = new Array(256).fill(0);
    
    for (let i = 0; i < sample.length; i++) {
      frequency[sample[i]]++;
    }
    
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
      if (frequency[i] > 0) {
        const p = frequency[i] / sample.length;
        entropy -= p * Math.log2(p);
      }
    }
    
    return entropy;
  }

  /**
   * Detect compression level based on entropy
   */
  static detectCompression(entropy) {
    if (entropy < 2) return 'Low - Easily compressible';
    if (entropy < 5) return 'Medium - Partially compressed';
    if (entropy < 7) return 'High - Well compressed';
    return 'Very High - Already compressed';
  }
}

/**
 * Archive utilities
 */
export class ArchiveUtils {
  /**
   * Get archive entry list preview
   */
  static getArchiveInfo(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return {
        filename: path.basename(filePath),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        canRead: fs.constants.R_OK & fs.accessSync(filePath) === 0
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}

/**
 * Code processing utilities
 */
export class CodeAnalyzer {
  /**
   * Detect programming language from content
   */
  static detectLanguage(code) {
    const patterns = {
      javascript: [/const\s+\w+\s*=/, /import\s+{/, /from\s+['"]/, /function\s*\(/],
      python: [/def\s+\w+\(/, /import\s+\w+/, /class\s+\w+:/, /if\s+__name__/],
      java: [/public\s+class\s+/, /import\s+/, /package\s+/, /;/],
      csharp: [/using\s+/, /namespace\s+/, /public\s+class\s+/],
      cpp: [/#include\s+</, /std::/],
      c: [/#include\s+</, /#define\s+/],
      objective_c: [/@interface\s+/, /@implementation\s+/, /@property/],
      swift: [/import\s+/, /func\s+\w+\s*\(/],
      kotlin: [/fun\s+\w+\s*\(/, /package\s+/],
      go: [/package\s+main/, /func\s+\w+\s*\(/],
      rust: [/fn\s+\w+\s*\(/, /use\s+/]
    };

    let scores = {};
    const lowerCode = code.toLowerCase();

    for (const [lang, patterns_list] of Object.entries(patterns)) {
      scores[lang] = patterns_list.filter(p => p.test(code)).length;
    }

    const detected = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return detected[0] ? detected[0][0] : 'unknown';
  }

  /**
   * Count lines of code
   */
  static countLOC(code) {
    const lines = code.split('\n');
    const totalLines = lines.length;
    const codeLines = lines.filter(l => l.trim().length > 0 && !l.trim().startsWith('//')).length;
    const commentLines = lines.filter(l => l.trim().startsWith('//')).length;
    const blankLines = lines.filter(l => l.trim().length === 0).length;

    return { totalLines, codeLines, commentLines, blankLines };
  }

  /**
   * Find function definitions
   */
  static extractFunctions(code) {
    const functionPattern = /(?:function|const\s+\w+\s*=|def\s+\w+|public\s+\w+)\s+(\w+)\s*\(/g;
    const functions = [];
    let match;

    while ((match = functionPattern.exec(code)) !== null) {
      functions.push({
        name: match[1],
        position: match.index
      });
    }

    return functions;
  }
}

/**
 * File processing utilities
 */
export class FileUtils {
  /**
   * Get directory tree structure
   */
  static getDirectoryTree(dirPath, maxDepth = 5, currentDepth = 0) {
    if (currentDepth >= maxDepth) return null;

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      const tree = {};

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          tree[entry.name] = this.getDirectoryTree(fullPath, maxDepth, currentDepth + 1);
        } else {
          const stats = fs.statSync(fullPath);
          tree[entry.name] = {
            size: stats.size,
            type: 'file'
          };
        }
      }

      return tree;
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Safe file read with size limit
   */
  static safeReadFile(filePath, maxBytes = 1048576) {
    try {
      const stats = fs.statSync(filePath);
      
      if (stats.size > maxBytes) {
        return fs.readFileSync(filePath, { encoding: 'utf-8', flag: 'r' }).substring(0, maxBytes);
      }

      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      return `Error reading file: ${error.message}`;
    }
  }

  /**
   * Compare file sizes
   */
  static compareFileSizes(originalPath, compressedPath) {
    try {
      const original = fs.statSync(originalPath).size;
      const compressed = fs.statSync(compressedPath).size;
      const ratio = ((1 - compressed / original) * 100).toFixed(2);

      return {
        originalSize: original,
        compressedSize: compressed,
        compressionRatio: `${ratio}%`,
        savedBytes: original - compressed
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default {
  BinaryAnalyzer,
  ArchiveUtils,
  CodeAnalyzer,
  FileUtils
};
