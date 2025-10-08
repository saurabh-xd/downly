export const runtime = "nodejs"; 

import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core'

export async function POST(request: NextRequest){
      
    try {
      const {url} = await request.json();
  
      if(!url || !ytdl.validateURL(url)){
          return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
      }
  
  
      const info = await ytdl.getInfo(url);
      const formats = info.formats
        .filter((f) => f.mimeType && f.qualityLabel)
        .map((f) => ({
          quality: f.qualityLabel,
          type: f.mimeType?.split(";")[0],
          url: f.url,
        }));

        const thumbnails = info.videoDetails.thumbnails;
const thumbnailUrl = thumbnails?.[thumbnails.length - 1]?.url ?? "";
  
      return NextResponse.json({
        title: info.videoDetails.title,
        thumbnail: thumbnailUrl,
        formats,
      });
    } 
     catch (error) {

       console.error(error);
    return Response.json({ error: "Failed to process video" }, { status: 500 });
      
    }
}