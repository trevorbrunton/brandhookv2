"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bomb } from "lucide-react";
import Link from "next/link";

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="grid min-h-full place-items-center mt-36 lg:px-8">
      <Card className=" w-96 h-full">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            <div className=" flex space-x-2 items-center">
              <Bomb className="w-4 h-4 text-red-800" />
              <span>An error has occurred </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={reset}
            className="mt-4 mr-6 bg-red-400 hover:bg-red-400/80"
          >
            Try again
          </Button>
          <Link href="/">
            <Button className="mt-4 mr-6 bg-blue-950">Go to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default error;
