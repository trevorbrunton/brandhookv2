'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

type Collection = {
  id: string
  collectionName: string
}

export function CollectionSelectorDialog() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
    const [open, setOpen] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections')
        const data = await response.json()
        setCollections(data)
      } catch (error) {
        console.error('Failed to fetch collections:', error)
      }
    }

    fetchCollections()
  }, [])

  const handleSelectCollection = (collectionId: string) => {
    setSelectedCollection(collectionId)
  }

  const handleGoToCollection = () => {
    if (selectedCollection) {
      setOpen(false)
      router.push(`/collection/${selectedCollection}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Select Collection</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose a Collection</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={handleSelectCollection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.collectionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGoToCollection} disabled={!selectedCollection}>
            Go to Collection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

