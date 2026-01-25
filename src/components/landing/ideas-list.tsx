import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'


function IdeasList( {ideas, updateStatus, IdeaStatus, getStatusBadgeVariant}) {
  return (
    <div className="grid gap-6">
          {ideas.map((idea) => (
            <Card key={idea.id} className="overflow-visible border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none bg-card">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 border-b-2 border-foreground bg-muted/30">
                <div className="space-y-1">
                   <CardTitle className="text-xl font-extrabold uppercase">{idea.title}</CardTitle>
                 </div>
                 <Badge 
                    variant={getStatusBadgeVariant(idea.status)}
                    className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold px-3 py-1"
                 >
                    {idea.status}
                 </Badge>
              </CardHeader>
              
               <CardContent className="p-4 min-h-[80px]">
                 {idea.description ? (
                  <p className="text-base font-medium leading-relaxed">{idea.description}</p>
                 ) : (
                  <p className="text-sm text-muted-foreground italic">No description provided.</p>
                 )}
               </CardContent>

              <CardFooter className="border-t-2 border-foreground p-3 bg-muted/10 flex gap-2 justify-end items-center">
                <p className="text-xs font-bold uppercase tracking-wider mr-auto pl-1 opacity-70">Status:</p>
                {(["ALIVE", "ON_HOLD", "DEAD"] as IdeaStatus[]).map(
                  (s) => (
                    <Button
                      key={s}
                      variant="ghost" 
                      size="sm"
                      onClick={() => updateStatus(idea.id, s)}
                      className={`
                        h-8 text-xs font-bold border-2 border-transparent hover:border-foreground hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all
                        ${idea.status === s ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "opacity-50 hover:opacity-100"}
                      `}
                    >
                      {s}
                    </Button>
                  )
                )}
              </CardFooter>
            </Card>
          ))}

          {ideas.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-foreground/30 rounded-lg">
              <p className="text-2xl font-bold text-muted-foreground uppercase opacity-50">No ideas yet.</p>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Start typing above to fill this void.</p>
            </div>
          )}
        </div>
  )
}

export default IdeasList