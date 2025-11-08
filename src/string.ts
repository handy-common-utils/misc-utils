export class StringUtils {
  /**
   * Preserve basic casing from a template single word and apply it to another word.
   *
   * Rules:
   * - If `casingTemplate` is all upper-case, return `word` in all upper-case.
   * - If `casingTemplate` is Title Case (first letter uppercase, rest lowercase), return
   *   `word` in Title Case.
   * - Otherwise return `word` as-is.
   *
   * This helper focuses on single-word tokens only and intentionally does not handle
   * complex multi-word or mixed-case patterns. Use for word-level casing preservation
   * (for example, to preserve input casing when returning a pluralized form).
   *
   * @param casingTemplate A word whose casing should be copied (e.g. 'Cat' or 'CAT')
   * @param word The word to apply casing to (usually a transformed/lowercased form)
   * @returns The `word` adjusted to match the template's basic casing
   */
  static applyWordCasing(casingTemplate: string, word: string): string {
    if (casingTemplate === casingTemplate.toUpperCase()) return word.toUpperCase();
    if (casingTemplate[0] === casingTemplate[0].toUpperCase() && casingTemplate.slice(1) === casingTemplate.slice(1).toLowerCase()) {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    }
    return word;
  }

  /**
   * Truncates a string to a specified length, optionally adding a suffix.
   * @param str The string to truncate
   * @param length Maximum length of the resulting string (including suffix if provided)
   * @param suffix Optional suffix to add to truncated string (default: '...')
   * @returns Truncated string
   */
  static truncate(str: string, length: number, suffix = '...'): string {
    if (!str || str.length <= length) return str;
    const truncatedLength = length - suffix.length;
    return truncatedLength <= 0 ? suffix.slice(0, length) : str.slice(0, truncatedLength) + suffix;
  }

  /**
   * Capitalises the first letter of a string, making the rest lowercase.
   * @param str The string to capitalise
   * @returns Capitalised string
   */
  static capitalise(str: string): string {
    return StringUtils.capitalize(str);
  }

  /**
   * Capitalizes the first letter of a string, making the rest lowercase.
   * @param str The string to capitalize
   * @returns Capitalized string
   */
  static capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Converts a camelCase string to snake_case.
   * @param str The camelCase string to convert
   * @returns snake_case string
   */
  static camelToSnake(str: string): string {
    if (!str) return str;
    return str
      .replaceAll(/([\da-z])([A-Z])/g, '$1_$2')
      .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .toLowerCase()
      .replace(/^_/, '');
  }

  /**
   * Converts a snake_case string to camelCase.
   * @param str The snake_case string to convert
   * @returns camelCase string
   */
  static snakeToCamel(str: string): string {
    if (!str) return str;
    return str
      .toLowerCase()
      .replaceAll(/_+([a-z])/g, (_: string, letter: string) => letter.toUpperCase());
  }

  /**
   * Returns the plural form of a single English word based on the supplied count.
   *
   * Capabilities:
   * - Preserves basic input casing (using `applyWordCasing`) so e.g. "Cat" -> "Cats",
   *   "CAT" -> "CATS".
   * - Handles common irregular plurals (person->people, child->children, mouse->mice, etc.).
   * - Treats a number of nouns as uncountable (sheep, fish, species, series, news, etc.).
   * - Applies common rules: f/fe -> ves (knife->knives), consonant+y -> ies (baby->babies),
   *   words ending with s/x/z/ch/sh -> add 'es'.
   * - For words ending with 'o' there is a small exceptions list that will add 'es' (hero,
   *   potato, tomato, echo, torpedo); otherwise 's' is added.
   *
   * Limitations and notes:
   * - This is a pragmatic, rule-based implementation covering the most common English cases,
   *   not a complete linguistic solution. It does not support locales or full irregular/exception
   *   lists (many English words have irregular forms not included here).
   * - The function expects a single word token. It does not pluralize multi-word phrases or
   *   attempt to inflect verbs. Use a dedicated library (for example, the 'pluralize' npm
   *   package) if you need comprehensive, production-grade pluralization.
   * - Casing preservation is basic (all-caps and Title Case); mixed/mid-word casing (camelCase,
   *   acronyms inside words) is not fully reconstructed.
   *
   * @param word The single English word to pluralize (may be mixed case)
   * @param count The numeric count; if equal to 1 the original word is returned
   * @returns The pluralized word with basic casing preserved
   */
  static pluralise(word: string, count: number): string {
    return StringUtils.pluralize(word, count);
  }


  /**
   * Returns the plural form of a single English word based on the supplied count.
   *
   * Capabilities:
   * - Preserves basic input casing (using `applyWordCasing`) so e.g. "Cat" -> "Cats",
   *   "CAT" -> "CATS".
   * - Handles common irregular plurals (person->people, child->children, mouse->mice, etc.).
   * - Treats a number of nouns as uncountable (sheep, fish, species, series, news, etc.).
   * - Applies common rules: f/fe -> ves (knife->knives), consonant+y -> ies (baby->babies),
   *   words ending with s/x/z/ch/sh -> add 'es'.
   * - For words ending with 'o' there is a small exceptions list that will add 'es' (hero,
   *   potato, tomato, echo, torpedo); otherwise 's' is added.
   *
   * Limitations and notes:
   * - This is a pragmatic, rule-based implementation covering the most common English cases,
   *   not a complete linguistic solution. It does not support locales or full irregular/exception
   *   lists (many English words have irregular forms not included here).
   * - The function expects a single word token. It does not pluralize multi-word phrases or
   *   attempt to inflect verbs. Use a dedicated library (for example, the 'pluralize' npm
   *   package) if you need comprehensive, production-grade pluralization.
   * - Casing preservation is basic (all-caps and Title Case); mixed/mid-word casing (camelCase,
   *   acronyms inside words) is not fully reconstructed.
   *
   * @param word The single English word to pluralize (may be mixed case)
   * @param count The numeric count; if equal to 1 the original word is returned
   * @returns The pluralized word with basic casing preserved
   */
  static pluralize(word: string, count: number): string {
    if (!word) return word;
    if (count === 1) return word;

    const lower = word.toLowerCase();

    // Uncountable nouns
    const uncountables = new Set([
      'sheep',
      'fish',
      'deer',
      'species',
      'series',
      'money',
      'rice',
      'information',
      'equipment',
      'news',
      'bison',
      'moose',
      'swine',
      'salmon',
      'trout',
    ]);
    if (uncountables.has(lower)) return word;

    // Irregular plurals
    const irregulars: Record<string, string> = {
      person: 'people',
      man: 'men',
      woman: 'women',
      child: 'children',
      tooth: 'teeth',
      foot: 'feet',
      mouse: 'mice',
      goose: 'geese',
      ox: 'oxen',
      louse: 'lice',
      cactus: 'cacti',
      nucleus: 'nuclei',
      syllabus: 'syllabi',
      focus: 'foci',
      phenomenon: 'phenomena',
      datum: 'data',
      radius: 'radii',
      index: 'indices',
      appendix: 'appendices',
      criterion: 'criteria',
    };
    if (Object.prototype.hasOwnProperty.call(irregulars, lower)) {
      return StringUtils.applyWordCasing(word, irregulars[lower]);
    }

    // Words that form plural by adding 'es' when ending with o
    const oEsExceptions = new Set(['hero', 'potato', 'tomato', 'echo', 'torpedo']);

    // Rules-based pluralization
    // f/fe -> ves (knife -> knives)
    if (/([a-z])(?:fe|f)$/.test(lower)) {
      return StringUtils.applyWordCasing(word, lower.replace(/(?:fe|f)$/, 'ves'));
    }

    // words ending with 'y' preceded by consonant -> replace y with ies
    if (/[b-df-hj-np-tv-z]y$/.test(lower)) {
      return StringUtils.applyWordCasing(word, lower.replace(/y$/, 'ies'));
    }

    // words ending with s, x, z, ch, sh -> add 'es'
    if (/(?:[sxz]|ch|sh)$/.test(lower)) {
      return StringUtils.applyWordCasing(word, lower + 'es');
    }

    // words ending with 'o' -> usually add 's', but some add 'es'
    if (lower.endsWith('o')) {
      if (oEsExceptions.has(lower)) return StringUtils.applyWordCasing(word, lower + 'es');
      return StringUtils.applyWordCasing(word, lower + 's');
    }

    // Default: just add 's'
    return StringUtils.applyWordCasing(word, lower + 's');
  }
}

// Export functions as constants for convenience
/**
 * Truncates a string to a specified length, optionally adding a suffix.
 * @param str The string to truncate
 * @param length Maximum length of the resulting string (including suffix if provided)
 * @param suffix Optional suffix to add to truncated string (default: '...')
 * @returns Truncated string
 */
export const truncate = StringUtils.truncate;

/**
 * Capitalizes the first letter of a string, making the rest lowercase.
 * @param str The string to capitalize
 * @returns Capitalized string
 */
export const capitalize = StringUtils.capitalize;

/**
 * Capitalises the first letter of a string, making the rest lowercase.
 * @param str The string to capitalise
 * @returns Capitalised string
 */
export const capitalise = StringUtils.capitalise;

/**
 * Converts a camelCase string to snake_case.
 * @param str The camelCase string to convert
 * @returns snake_case string
 */
export const camelToSnake = StringUtils.camelToSnake;

/**
 * Converts a snake_case string to camelCase.
 * @param str The snake_case string to convert
 * @returns camelCase string
 */
export const snakeToCamel = StringUtils.snakeToCamel;

/**
 * Returns the plural form of a single English word based on the supplied count.
 *
 * Capabilities:
 * - Preserves basic input casing (using `applyWordCasing`) so e.g. "Cat" -> "Cats",
 *   "CAT" -> "CATS".
 * - Handles common irregular plurals (person->people, child->children, mouse->mice, etc.).
 * - Treats a number of nouns as uncountable (sheep, fish, species, series, news, etc.).
 * - Applies common rules: f/fe -> ves (knife->knives), consonant+y -> ies (baby->babies),
 *   words ending with s/x/z/ch/sh -> add 'es'.
 * - For words ending with 'o' there is a small exceptions list that will add 'es' (hero,
 *   potato, tomato, echo, torpedo); otherwise 's' is added.
 *
 * Limitations and notes:
 * - This is a pragmatic, rule-based implementation covering the most common English cases,
 *   not a complete linguistic solution. It does not support locales or full irregular/exception
 *   lists (many English words have irregular forms not included here).
 * - The function expects a single word token. It does not pluralize multi-word phrases or
 *   attempt to inflect verbs. Use a dedicated library (for example, the 'pluralize' npm
 *   package) if you need comprehensive, production-grade pluralization.
 * - Casing preservation is basic (all-caps and Title Case); mixed/mid-word casing (camelCase,
 *   acronyms inside words) is not fully reconstructed.
 *
 * @param word The single English word to pluralize (may be mixed case)
 * @param count The numeric count; if equal to 1 the original word is returned
 * @returns The pluralized word with basic casing preserved
 */
export const pluralize = StringUtils.pluralize;

/**
 * Returns the plural form of a single English word based on the supplied count (alias).
 *
 * See `pluralize` for capabilities and limitations.
 *
 * @param word The single English word to pluralize (may be mixed case)
 * @param count The numeric count; if equal to 1 the original word is returned
 * @returns The pluralized word with basic casing preserved
 */
export const pluralise = StringUtils.pluralise;

/**
 * Preserve basic casing from a template single word and apply it to another word.
 *
 * Rules:
 * - If `casingTemplate` is all upper-case, return `word` in all upper-case.
 * - If `casingTemplate` is Title Case (first letter uppercase, rest lowercase), return
 *   `word` in Title Case.
 * - Otherwise return `word` as-is.
 *
 * This helper focuses on single-word tokens only and intentionally does not handle
 * complex multi-word or mixed-case patterns. Use for word-level casing preservation
 * (for example, to preserve input casing when returning a pluralized form).
 *
 * @param casingTemplate A word whose casing should be copied (e.g. 'Cat' or 'CAT')
 * @param word The word to apply casing to (usually a transformed/lowercased form)
 * @returns The `word` adjusted to match the template's basic casing
 */
export const applyWordCasing = StringUtils.applyWordCasing;