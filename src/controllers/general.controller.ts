import { Request, Response } from 'express';

// --- HELPER: Get avatar headshot (Roblox thumbnails API) ---
const getAvatarHeadshot = async (userId: number): Promise<string> => {
    try {
        const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`;
        const response = await fetch(url);
        if (!response.ok) return "";
        const data: any = await response.json();
        if (data && data.data && data.data.length > 0) {
            return data.data[0].imageUrl || "";
        }
        return "";
    } catch (e) {
        console.error(`Avatar fetch failed for ${userId}:`, e);
        return "";
    }
};

// --- DONATE ROUTE ---
export const handleDonate = async (req: Request, res: Response) => {
  try {
    const { userId, username, amount, message, mapName } = req.body; 
    const finalUsername = username || `User_${userId}`; 
    
    const webhookUrl = process.env.DISCORD_WEBHOOK_DONATE;

    if (typeof userId !== 'number' || typeof amount !== 'number') {
        res.status(400).json({ success: false, message: "Invalid or missing userId / amount" });
        return;
    }

    // 1. Get Avatar
    const avatarUrl = await getAvatarHeadshot(userId);

    // 2. Send to Discord (Thai, cute tone)
    if (webhookUrl) {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "💰 ขอบคุณสำหรับการโดเนทนะคะ!",
                    description: `ขอบคุณที่สนับสนุนพวกเรานะคะ คุณ ${finalUsername} 💖`,
                    color: 5814783,
                    thumbnail: { url: avatarUrl },
                    fields: [
                        { name: "ผู้เล่น", value: `${finalUsername} (${userId})`, inline: true },
                        { name: "จำนวนโดเนท", value: `${amount} Robux`, inline: true },
                        { name: "แมพที่เล่นอยู่", value: mapName || "ไม่ทราบแมพ", inline: true },
                        { name: "ข้อความจากผู้เล่น", value: message || "ไม่มีข้อความพิเศษค่ะ" }
                    ],
                    timestamp: new Date().toISOString()
                }] as any
            })
        });
    }

    res.status(200).json({ success: true, message: "Donation processed" });

  } catch (error: any) {
    console.error("Donate Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- FEEDBACK ROUTE ---
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { userId, username, rating, message, mapName } = req.body;
    const finalUsername = username || `User_${userId}`;

    const webhookUrl = process.env.DISCORD_WEBHOOK_FEEDBACK;

    if (message && message.length > 1000) {
        res.status(400).json({ message: "Message too long." });
        return;
    }

    if (typeof userId !== 'number' || typeof rating !== 'number') {
        res.status(400).json({ message: "Invalid or missing userId / rating" });
        return;
    }

    // 1. Map Rating
    let ratingText = "";
    switch (rating) {
        case 1: ratingText = "1/5 ไม่ปลื้มเลยค่ะ 🤢"; break;
        case 2: ratingText = "2/5 ยังไม่ค่อยดีเท่าไหร่ค่ะ ☹️"; break;
        case 3: ratingText = "3/5 เฉย ๆ กลาง ๆ น้า 😐"; break;
        case 4: ratingText = "4/5 สนุกใช้ได้เลยค่ะ 🙂"; break;
        case 5: ratingText = "5/5 รักมากกก ขอบคุณที่ชอบแมพเรานะคะ 🤩"; break;
        default: ratingText = `${rating}/5`;
    }

    // 2. Get Avatar
    const avatarUrl = await getAvatarHeadshot(userId);

    // 3. Send to Discord (Thai, cute tone)
    if (webhookUrl) {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "📝 ฟีดแบ็กใหม่มาแล้วน้า",
                    description: `คุณ ${finalUsername} ฝากฟีดแบ็กน่ารัก ๆ มาให้ค่ะ ขอบคุณที่ช่วยพัฒนาแมพของเรานะคะ 💕`,
                    color: 3066993,
                    thumbnail: { url: avatarUrl },
                    fields: [
                        { name: "ผู้เล่น", value: `${finalUsername} (${userId})`, inline: true },
                        { name: "คะแนนความพอใจ", value: ratingText, inline: true },
                        { name: "แมพที่เล่นอยู่", value: mapName || "ไม่ทราบแมพ", inline: true },
                        { name: "ข้อความฟีดแบ็ก", value: message || "ยังไม่ได้เขียนอะไรไว้เลยค่ะ" }
                    ],
                    timestamp: new Date().toISOString()
                }] as any
            })
        });
    }

    res.status(200).json({ success: true, message: "Feedback received" });

  } catch (error: any) {
    console.error("Feedback Error:", error);
    res.status(500).json({ message: error.message });
  }
};