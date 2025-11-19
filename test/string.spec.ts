import { expect } from 'chai';
 
import { applyWordCasing, camelToSnake, capitalise, capitalize, escapeXml, pluralise, pluralize, snakeToCamel, truncate, unescapeXml } from '../src/string';

describe('StringUtils', () => {
  describe('truncate', () => {
    it('should return original string if shorter than length', () => {
      expect(truncate('hello', 10)).to.equal('hello');
    });

    it('should truncate string with default suffix', () => {
      expect(truncate('hello world', 8)).to.equal('hello...');
    });

    it('should truncate string with custom suffix', () => {
      expect(truncate('hello world', 8, '!')).to.equal('hello w!');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).to.equal('');
    });

    it('should handle very short length', () => {
      expect(truncate('hello', 2, '...')).to.equal('..');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter and lowercase rest', () => {
      expect(capitalize('hELLo')).to.equal('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).to.equal('');
    });

    it('should handle single letter', () => {
      expect(capitalize('a')).to.equal('A');
    });
  });

  describe('camelToSnake', () => {
    it('should convert camelCase to snake_case', () => {
      expect(camelToSnake('helloWorld')).to.equal('hello_world');
    });

    it('should handle consecutive capitals', () => {
      expect(camelToSnake('JSONData')).to.equal('json_data');
    });

    it('should handle empty string', () => {
      expect(camelToSnake('')).to.equal('');
    });

    it('should handle single word', () => {
      expect(camelToSnake('hello')).to.equal('hello');
    });
  });

  describe('snakeToCamel', () => {
    it('should convert snake_case to camelCase', () => {
      expect(snakeToCamel('hello_world')).to.equal('helloWorld');
    });

    it('should handle consecutive underscores', () => {
      expect(snakeToCamel('hello__world')).to.equal('helloWorld');
    });

    it('should handle empty string', () => {
      expect(snakeToCamel('')).to.equal('');
    });

    it('should handle single word', () => {
      expect(snakeToCamel('hello')).to.equal('hello');
    });
  });

  describe('pluralize', () => {
    it('should not pluralize when count is 1', () => {
      expect(pluralize('cat', 1)).to.equal('cat');
    });

    it('should pluralize when count is 0', () => {
      expect(pluralize('cat', 0)).to.equal('cats');
    });

    it('should pluralize when count is greater than 1', () => {
      expect(pluralize('cat', 2)).to.equal('cats');
    });

    it('should handle empty string', () => {
      expect(pluralize('', 2)).to.equal('');
    });

    it('should handle irregular plurals', () => {
      expect(pluralize('person', 2)).to.equal('people');
      expect(pluralize('child', 2)).to.equal('children');
      expect(pluralize('mouse', 2)).to.equal('mice');
      expect(pluralize('man', 2)).to.equal('men');
    });

    it('should handle f/fe -> ves', () => {
      expect(pluralize('knife', 2)).to.equal('knives');
      expect(pluralize('leaf', 2)).to.equal('leaves');
    });

    it('should handle y -> ies', () => {
      expect(pluralize('baby', 2)).to.equal('babies');
    });

    it('should handle s/x/ch/sh -> es', () => {
      expect(pluralize('bus', 2)).to.equal('buses');
      expect(pluralize('match', 2)).to.equal('matches');
    });

    it('should handle o exceptions and regular o', () => {
      expect(pluralize('hero', 2)).to.equal('heroes');
      expect(pluralize('photo', 2)).to.equal('photos');
    });

    it('should handle uncountables', () => {
      expect(pluralize('sheep', 2)).to.equal('sheep');
    });
  });

  describe('aliases and helpers', () => {
    describe('applyWordCasing', () => {
      it('should upper-case result when template is all upper-case', () => {
        expect(applyWordCasing('DOG', 'dogs')).to.equal('DOGS');
      });

      it('should Title Case result when template is Title Case', () => {
        expect(applyWordCasing('Cat', 'cats')).to.equal('Cats');
      });

      it('should return result as-is for mixed case template', () => {
        expect(applyWordCasing('cAt', 'cats')).to.equal('cats');
      });
    });

    it('capitalise alias should behave like capitalize', () => {
      expect(capitalise('hELLo')).to.equal('Hello');
      expect(capitalise('')).to.equal('');
    });

    it('pluralise alias should behave like pluralize', () => {
      expect(pluralise('cat', 2)).to.equal('cats');
      expect(pluralise('child', 2)).to.equal('children');
      expect(pluralise('dog', 1)).to.equal('dog');
    });
  });

  describe('escapeXml', () => {
    it('should escape all XML special characters', () => {
      expect(escapeXml("<tag attr='val'>&\"</tag>")).to.equal('&lt;tag attr=&apos;val&apos;&gt;&amp;&quot;&lt;/tag&gt;');
    });
    it('should return original string if no special characters', () => {
      expect(escapeXml('hello world')).to.equal('hello world');
    });
    it('should handle empty string', () => {
      const input: string | undefined = '';
      expect(escapeXml(input)).to.equal('');
    });
    it('should escape only the relevant characters', () => {
      expect(escapeXml('a&b<c>d"e\'f')).to.equal('a&amp;b&lt;c&gt;d&quot;e&apos;f');
    });

    it('should handle undefined input', () => {
      const input: string | undefined = undefined;
      expect(escapeXml(input)).to.equal(undefined);
    });
    it('should handle null input', () => {
      const input: string | null = null;
      expect(escapeXml(input)).to.equal(null);
    });
  });

  describe('unescapeXml', () => {
    it('should unescape all XML entities', () => {
      expect(unescapeXml('&lt;tag attr=&apos;val&apos;&gt;&amp;&quot;&lt;/tag&gt;')).to.equal("<tag attr='val'>&\"</tag>");
    });
    it('should return original string if no entities', () => {
      expect(unescapeXml('hello world')).to.equal('hello world');
    });
    it('should handle empty string', () => {
      expect(unescapeXml('')).to.equal('');
    });
    it('should handle undefined input', () => {
      const input: string | undefined = undefined;
      expect(unescapeXml(input)).to.equal(undefined);
    });
    it('should handle null input', () => {
      const input: string | undefined | null = null;
      expect(unescapeXml(input)).to.equal(null);
    });
    it('should unescape only the relevant entities', () => {
      expect(unescapeXml('a&amp;b&lt;c&gt;d&quot;e&apos;f')).to.equal('a&b<c>d"e\'f');
    });
  });
});