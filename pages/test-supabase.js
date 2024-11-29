'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function TestSupabase() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleInsert() {
    try {
      setLoading(true)
      setError(null)
      
      const testProfile = {
        name: { first: "Test", last: "User" },
        relationship: { type: "self" },
        occasions: [{ type: "birthday", date: "2024-01-01" }],
        preferences: { 
          interests: ["testing", "coding"],
          favorite_colors: ["blue", "green"]
        },
        notifications: { email: true, push: false },
        history: []
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([testProfile])
        .select()

      if (error) throw error
      
      await fetchProfiles()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
    
    if (error) throw error
    setData(data)
  }

  async function handleDelete(id) {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      await fetchProfiles()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Teste Supabase</h1>
      
      <div className="space-x-4">
        <button 
          onClick={handleInsert}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Lädt...' : 'Neues Profil'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Fehler: {error}
        </div>
      )}

      {data && (
        <div className="mt-4">
          <h2 className="text-lg mb-2">Profile ({data.length}):</h2>
          <div className="space-y-4">
            {data.map(profile => (
              <div key={profile.id} className="bg-gray-100 p-4 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">
                      {profile.name.first} {profile.name.last}
                    </p>
                    <p className="text-sm text-gray-600">ID: {profile.id}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Löschen
                  </button>
                </div>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
