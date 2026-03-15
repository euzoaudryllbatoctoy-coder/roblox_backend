/**
 * Discord embed message config
 *
 * Edit this file to change the text shown in Discord for donations and feedback.
 *
 * In description strings you can use:
 *   {{username}}  – player name (donate & feedback)
 *   {{amount}}    – donation amount (donate only)
 *   {{rating}}    – rating label e.g. "5/5 – Great!" (feedback only)
 */

export const discordMessages = {
  donate: {
    title: "💰 Thank you for your donation!",
    description: "Thanks for your support, {{username}}!",
    fieldLabels: {
      player: "Player",
      amount: "Amount",
      map: "Map",
      message: "Message",
    },
    defaultMap: "Unknown",
    defaultMessage: "No message",
    color: 5814783, // Purple
  },

  feedback: {
    title: "📝 New feedback received",
    description: "{{username}} left some feedback. Thanks for helping us improve!",
    fieldLabels: {
      player: "Player",
      rating: "Rating",
      map: "Map",
      message: "Feedback",
    },
    defaultMap: "Unknown",
    defaultMessage: "No message",
    color: 3066993, // Green
    ratingLabels: {
      1: "1/5 – Poor",
      2: "2/5 – Fair",
      3: "3/5 – Okay",
      4: "4/5 – Good",
      5: "5/5 – Great!",
    },
  },
} as const;

export type DiscordMessagesConfig = typeof discordMessages;
