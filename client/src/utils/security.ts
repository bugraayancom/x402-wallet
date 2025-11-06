/**
 * Known phishing domains
 */
const KNOWN_PHISHING_DOMAINS = [
  'metamask-wallet.com',
  'metamask-support.com',
  'uniswap-exchange.com',
  'coinbase-wallet.com',
  // Add more as needed
];

/**
 * Suspicious patterns in URLs
 */
const SUSPICIOUS_PATTERNS = [
  /metamask.*wallet/i,
  /uniswap.*exchange/i,
  /coinbase.*login/i,
  /claim.*airdrop/i,
  /verify.*wallet/i,
  /connect.*wallet/i,
];

/**
 * Check if URL is a known phishing site
 */
export function isPhishingSite(url: string): {
  isPhishing: boolean;
  reason?: string;
  confidence: 'high' | 'medium' | 'low';
} {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.toLowerCase();

    // Check against known phishing domains
    if (KNOWN_PHISHING_DOMAINS.some((d) => domain.includes(d))) {
      return {
        isPhishing: true,
        reason: 'This domain is known for phishing attacks',
        confidence: 'high',
      };
    }

    // Check for suspicious patterns
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(url)) {
        return {
          isPhishing: true,
          reason: 'This URL contains suspicious patterns commonly used in phishing',
          confidence: 'medium',
        };
      }
    }

    // Check for homograph attacks (similar looking characters)
    if (containsHomographs(domain)) {
      return {
        isPhishing: true,
        reason: 'This domain uses characters that look similar to legitimate sites',
        confidence: 'medium',
      };
    }

    // Check for suspicious TLDs
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top'];
    if (suspiciousTlds.some((tld) => domain.endsWith(tld))) {
      return {
        isPhishing: false, // Not blocking, just warning
        reason: 'This domain uses a TLD commonly associated with phishing',
        confidence: 'low',
      };
    }

    return { isPhishing: false, confidence: 'low' };
  } catch {
    return {
      isPhishing: true,
      reason: 'Invalid URL format',
      confidence: 'high',
    };
  }
}

/**
 * Check if domain contains homograph characters
 */
function containsHomographs(domain: string): boolean {
  const homographs: Record<string, string[]> = {
    a: ['а', 'ɑ', 'α'],
    e: ['е', 'ē', 'ė'],
    o: ['о', 'ο', 'σ'],
    i: ['і', 'ı', 'ί'],
    p: ['р', 'ρ'],
    c: ['с', 'ϲ'],
    x: ['х', 'χ'],
    y: ['у', 'ү', 'ყ'],
  };

  for (const [ascii, lookalikes] of Object.entries(homographs)) {
    for (const lookalike of lookalikes) {
      if (domain.includes(lookalike)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if transaction appears suspicious
 */
export function analyzeTr ansaction(params: {
  to: string;
  value: string;
  data?: string;
  from: string;
}): {
  isSuspicious: boolean;
  warnings: string[];
  riskLevel: 'low' | 'medium' | 'high';
} {
  const warnings: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  // Check for large amounts
  const amount = parseFloat(params.value);
  if (amount > 10) {
    warnings.push('Large transaction amount detected');
    riskLevel = 'medium';
  }

  // Check for contract interactions
  if (params.data && params.data !== '0x') {
    warnings.push('This transaction will interact with a smart contract');
    riskLevel = 'medium';
  }

  // Check if sending to same address
  if (params.from.toLowerCase() === params.to.toLowerCase()) {
    warnings.push('Sending to your own address');
    riskLevel = 'low';
  }

  // Check for zero address
  if (params.to === '0x0000000000000000000000000000000000000000') {
    warnings.push('Warning: Sending to zero address will burn tokens');
    riskLevel = 'high';
  }

  // Check for suspicious contract patterns
  if (params.data && containsSuspiciousContractCall(params.data)) {
    warnings.push('This contract call contains potentially dangerous operations');
    riskLevel = 'high';
  }

  return {
    isSuspicious: warnings.length > 0,
    warnings,
    riskLevel,
  };
}

/**
 * Check for suspicious contract function calls
 */
function containsSuspiciousContractCall(data: string): boolean {
  const suspiciousFunctions = [
    '0xa9059cbb', // transfer
    '0x095ea7b3', // approve
    '0x23b872dd', // transferFrom
    '0x42842e0e', // safeTransferFrom (NFT)
    '0xb88d4fde', // safeTransferFrom with data (NFT)
  ];

  // Check if data starts with any suspicious function selector
  return suspiciousFunctions.some((selector) => data.startsWith(selector));
}

/**
 * Generate a security score for a transaction
 */
export function calculateSecurityScore(params: {
  to: string;
  value: string;
  data?: string;
  from: string;
  chainId: number;
}): {
  score: number; // 0-100
  level: 'safe' | 'caution' | 'danger';
  factors: string[];
} {
  let score = 100;
  const factors: string[] = [];

  // Deduct points for various risk factors
  const amount = parseFloat(params.value);
  if (amount > 1) {
    score -= 10;
    factors.push('Large amount');
  }

  if (params.data && params.data !== '0x') {
    score -= 15;
    factors.push('Contract interaction');
  }

  if (containsSuspiciousContractCall(params.data || '0x')) {
    score -= 20;
    factors.push('Token approval/transfer');
  }

  // Determine level
  let level: 'safe' | 'caution' | 'danger';
  if (score >= 80) {
    level = 'safe';
  } else if (score >= 50) {
    level = 'caution';
  } else {
    level = 'danger';
  }

  return { score, level, factors };
}

/**
 * Encrypt sensitive data before storing (basic implementation)
 */
export function encryptData(data: string, key: string): string {
  // In production, use a proper encryption library like crypto-js
  // This is a basic implementation for demonstration
  return btoa(data);
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedData: string, key: string): string {
  try {
    return atob(encryptedData);
  } catch {
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Check if browser is secure
 */
export function isBrowserSecure(): {
  isSecure: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Check if HTTPS
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    warnings.push('Not using HTTPS connection');
  }

  // Check if extensions are detected
  if (isPrivateBrowsing()) {
    warnings.push('Private browsing mode detected');
  }

  return {
    isSecure: warnings.length === 0,
    warnings,
  };
}

/**
 * Detect private browsing mode
 */
function isPrivateBrowsing(): boolean {
  try {
    localStorage.setItem('__test__', 'test');
    localStorage.removeItem('__test__');
    return false;
  } catch {
    return true;
  }
}
