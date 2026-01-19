'use client'
import axios from 'axios';
import React, { useState } from 'react'

function page() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();

   try {
     const res = await axios.post('/api/auth/signin', form)
     alert(res.data.message);
   } catch (error: any) {
      alert(error.response?.data?.error || "Something went wrong");
   }
  }

  return (

 <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 space-y-4"
    >
      <h1 className="text-xl font-bold">Signin</h1>

    

      <input
        placeholder="Email"
        className="border p-2 w-full"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button type="submit" className="border px-4 py-2">
        Signin
      </button>
    </form>
  )
}

export default page