/**
 * Blacklisted MicrosoftId data
 */
export interface BlacklistIF {
  /**
   * The MicrosoftId to be blacklisted
   */
  MicrosoftId: string;

  /**
   * When was the MicrosoftId blacklisted
   */
  CreatedAt: Date;

  /**
   * For what reason was the MicrosoftId blacklisted
   */
  Reason: string;
};
