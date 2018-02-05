import _ from 'lodash';
import logger from 'winston';

import bot from '~/bot';

export default class Command {
  static args = [];
  static permissionsRequired = [];

  instanceArgs = {};
  valid = true;

  mapArgs = commandArgs => {
    _.each(this.constructor.args, (arg, idx) => {
      this.instanceArgs[arg] = commandArgs[idx];
    });
  };

  constructor(commandArgs, message) {
    if (!this.runCommand) {
      throw new Error('runCommand() script not defined for command class');
    }

    if (commandArgs.length !== this.constructor.args.length) {
      this.valid = false;
    }

    this.mapArgs(commandArgs);
    this.message = message;
  }

  async run() {
    if (!this.valid) return;
    if (!bot.readyAt) return;

    let hasPermission = true;

    if (this.constructor.permissionsRequired.length) {
      hasPermission = this.message.member.hasPermission(
        this.constructor.permissionsRequired
      );
    }

    if (!hasPermission) {
      logger.info('Command prevented because of unmet permissions');
      return;
    }

    await this.runCommand(this.instanceArgs, this.message);
  }
}
