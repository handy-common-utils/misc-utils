import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { LineLogger } from '../src/line-logger';
chai.use(sinonChai);

describe('LineLogger', () => {
  describe('ConsoleLineLogger', () => {
    beforeEach(() => {
      sinon.stub(console, 'log');
      sinon.stub(console, 'info');
    });
    afterEach(() => {
      (console.log as any).restore();
      (console.info as any).restore();
    });

    it('enables debug output when debug flag is true', () => {
      const logger = LineLogger.console({ debug: true });
      logger.debug('text');
      expect(console.log).to.be.called;
    });
    it('mutes debug output when debug flag is false', () => {
      const logger = LineLogger.console({ debug: false });
      logger.debug('text');
      expect(console.log).to.not.be.called;
    });
    it('mutes both debug and info output when quiet flag is true', () => {
      const logger = LineLogger.console({ quiet: true });
      logger.debug('text');
      logger.info('text');
      expect(console.log).to.not.be.called;
      expect(console.info).to.not.be.called;
    });
    it('mutes both debug and info output when quiet flag is true and debug flag is also true', () => {
      const logger = LineLogger.console({ quiet: true, debug: true });
      logger.debug('text');
      logger.info('text');
      expect(console.log).to.not.be.called;
      expect(console.info).to.not.be.called;
    });
  });
});
