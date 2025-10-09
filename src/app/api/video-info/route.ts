export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

const agent = ytdl.createAgent();

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || !ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" }, 
        { status: 400 }
      );
    }

    const info = await ytdl.getInfo(url, { agent });
    
    const formats = info.formats
      .filter((f) => f.hasVideo && f.hasAudio && f.qualityLabel) // Videos with audio
      .map((f) => ({
        itag: f.itag,
        quality: f.qualityLabel,
        type: f.mimeType?.split(";")[0],
        filesize: f.contentLength,
      }))
      .sort((a, b) => {
        const qualityOrder: any = { '1080p': 4, '720p': 3, '480p': 2, '360p': 1 };
        return (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0);
      });

    const thumbnails = info.videoDetails.thumbnails;
    const thumbnailUrl = thumbnails?.[thumbnails.length - 1]?.url ?? "";

    return NextResponse.json({
      title: info.videoDetails.title,
      thumbnail: thumbnailUrl,
      duration: info.videoDetails.lengthSeconds,
      formats,
      videoUrl: url, // Store original URL
    });
  } catch (error: any) {
    console.error('Error details:', error.message);
    return NextResponse.json(
      { error: error.message || "Failed to process video" }, 
      { status: 500 }
    );
  }
}