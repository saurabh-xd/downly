export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

const agent = ytdl.createAgent();

export async function POST(request: NextRequest) {
  try {
    const { url, itag } = await request.json();

    if (!url || !ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" }, 
        { status: 400 }
      );
    }

    const info = await ytdl.getInfo(url, { agent });
    const format = itag 
      ? info.formats.find(f => f.itag.toString() === itag)
      : ytdl.chooseFormat(info.formats, { quality: 'highest' });

    if (!format || !format.url) {
      return NextResponse.json(
        { error: "Format not found" }, 
        { status: 404 }
      );
    }

    const fileName = `${info.videoDetails.title.replace(/[^a-z0-9]/gi, '_')}.mp4`;

    return NextResponse.json({
      downloadUrl: format.url,
      fileName: fileName
    });

  } catch (error: any) {
    console.error('Download error:', error.message);
    return NextResponse.json(
      { error: "Failed to get download link" }, 
      { status: 500 }
    );
  }
}