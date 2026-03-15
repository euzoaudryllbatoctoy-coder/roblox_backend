import { Request, Response } from 'express';
import { discordMessages } from '../config/discord-messages';

function replacePlaceholders(text: string, values: Record<string, string | number>): string {
  let result = text;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
  }
  return result;
}

const getAvatarHeadshot = async (userId: number): Promise<string> => {
  try {
    const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`;
    const response = await fetch(url);
    if (!response.ok) return "";
    const data: any = await response.json();
    if (data?.data?.length > 0) {
      return data.data[0].imageUrl || "";
    }
    return "";
  } catch (e) {
    console.error(`Avatar fetch failed for ${userId}:`, e);
    return "";
  }
};

export const handleDonate = async (req: Request, res: Response) => {
  try {
    const { userId, username, amount, message, mapName } = req.body;
    const finalUsername = username || `User_${userId}`;
    const webhookUrl = process.env.DISCORD_WEBHOOK_DONATE;
    const cfg = discordMessages.donate;

    if (typeof userId !== 'number' || typeof amount !== 'number') {
      res.status(400).json({ success: false, message: "Invalid or missing userId / amount" });
      return;
    }

    const avatarUrl = await getAvatarHeadshot(userId);

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: cfg.title,
            description: replacePlaceholders(cfg.description, { username: finalUsername }),
            color: cfg.color,
            thumbnail: { url: avatarUrl },
            fields: [
              { name: cfg.fieldLabels.player, value: `${finalUsername} (${userId})`, inline: true },
              { name: cfg.fieldLabels.amount, value: `${amount} Robux`, inline: true },
              { name: cfg.fieldLabels.map, value: mapName || cfg.defaultMap, inline: true },
              { name: cfg.fieldLabels.message, value: message || cfg.defaultMessage }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      });
    }

    res.status(200).json({ success: true, message: "Donation processed" });
  } catch (error: any) {
    console.error("Donate Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { userId, username, rating, message, mapName } = req.body;
    const finalUsername = username || `User_${userId}`;
    const webhookUrl = process.env.DISCORD_WEBHOOK_FEEDBACK;
    const cfg = discordMessages.feedback;

    if (message && message.length > 1000) {
      res.status(400).json({ message: "Message too long." });
      return;
    }

    if (typeof userId !== 'number' || typeof rating !== 'number') {
      res.status(400).json({ message: "Invalid or missing userId / rating" });
      return;
    }

    const ratingText = cfg.ratingLabels[rating as 1 | 2 | 3 | 4 | 5] ?? `${rating}/5`;
    const avatarUrl = await getAvatarHeadshot(userId);

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: cfg.title,
            description: replacePlaceholders(cfg.description, { username: finalUsername, rating: ratingText }),
            color: cfg.color,
            thumbnail: { url: avatarUrl },
            fields: [
              { name: cfg.fieldLabels.player, value: `${finalUsername} (${userId})`, inline: true },
              { name: cfg.fieldLabels.rating, value: ratingText, inline: true },
              { name: cfg.fieldLabels.map, value: mapName || cfg.defaultMap, inline: true },
              { name: cfg.fieldLabels.message, value: message || cfg.defaultMessage }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      });
    }

    res.status(200).json({ success: true, message: "Feedback received" });
  } catch (error: any) {
    console.error("Feedback Error:", error);
    res.status(500).json({ message: error.message });
  }
};
