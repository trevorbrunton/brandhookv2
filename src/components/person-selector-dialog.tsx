'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { fetchPeopleByUserId } from '@/app/actions/fetch-people-by-userId'

type Person = {
  id: string
  name: string
}


export function PersonSelectorDialog() {
  const [people, setPeople] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
    const [open, setOpen] = useState(false);
  const router = useRouter()
  console.log("baingan");


  //DEVNOTE - CONVERT THIS TO USER REACT-QUERY
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const thePeople = await fetchPeopleByUserId()

        if (Array.isArray(thePeople)) {
          setPeople(thePeople);
        } else {
          setPeople([]);
        }
      } catch (error) {
        console.error('Failed to fetch people:', error)
      }
    }

    fetchPeople()
  }, [])

  const handleSelectPerson = (personId: string) => {
    setSelectedPerson(personId)
  }

  const handleGoToPerson = () => {
    if (selectedPerson) {
      setOpen(false)
      router.push(`/view-person/${selectedPerson}`)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">Go to People</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose a Person</DialogTitle>
          </DialogHeader>
          {people.length ? (
            <div className="grid gap-4 py-4">
              <Select onValueChange={handleSelectPerson}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/view-person/new")}
              >
                Add a new person?
                </Button>
              <Button onClick={handleGoToPerson} disabled={!selectedPerson}>
                Go to Person
              </Button>
                </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push("/view-person/new")}
            >
              You have no people yet. Add one?
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

