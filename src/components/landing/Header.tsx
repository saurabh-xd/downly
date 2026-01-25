import React from 'react'
import { Button } from '../ui/button'

export default function Header({isLoading, isLoggedIn, logout}) {
  return (
    <div>
         {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-foreground pb-6">
          <div>
           <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter bg-white border-4 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
            Idea Graveyard
          </h1>
            <p className="text-muted-foreground font-medium text-lg mt-5">
              Manage your <span className="text-primary font-bold">brilliant</span> (and dead) ideas.
            </p>
          </div>

          {isLoading ? (
             <Button disabled variant="ghost" className="border-2 border-transparent">Loading...</Button>
          ) : isLoggedIn ? (
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold"
            >
              Logout : Logging out
            </Button>
          ) : (
            <div className="flex space-x-3">
              <a href="/signin">
                <Button variant="ghost" size="sm" className="font-bold border-2 border-transparent hover:border-foreground hover:bg-transparent">Sign In</Button>
              </a>
              <a href="/signup">
                <Button size="sm" className="border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold bg-primary text-white hover:bg-primary/90">Sign Up</Button>
              </a>
            </div>
          )}
        </div>

        {/* Guest notice */}
        {!isLoggedIn && !isLoading && (
          <div className="border-2 border-foreground bg-accent text-accent-foreground p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-sm font-bold">
              <span className="text-lg mr-2">👾</span> 
              Guest Mode active. Ideas will vanish on refresh.
            </div>
            <a href="/signup">
              <Button variant="secondary" size="sm" className="border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none font-bold">
                Create Account
              </Button>
            </a>
          </div>
        )}
    </div>
  )
}
