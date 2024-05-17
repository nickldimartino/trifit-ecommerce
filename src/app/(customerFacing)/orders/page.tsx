"use client";

// -------------------------------- Import Modules ---------------------------------
// External
import { useFormState, useFormStatus } from "react-dom";

// Internal
import { emailOrderHistory } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ----------------------------------- Components ----------------------------------
// My Orders Page
export default function MyOrdersPage() {
  const [data, action] = useFormState(emailOrderHistory, {});
  return (
    <form action={action} className="max-2-xl mx-auto border border-black rounded-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-yellowgreen">My Orders</CardTitle>
          <CardDescription className="text-black">
            Enter your email and we will email you your order history and
            download links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" required name="email" id="email" />
            {data.error && <div className="text-destructive">{data.error}</div>}
          </div>
        </CardContent>
        <CardFooter>
          {data.message ? <p>{data.message}</p> : <SubmitButton />}
        </CardFooter>
      </Card>
    </form>
  );
}

// ----------------------------------- Functions -----------------------------------
// Submit button will change it's look if it's in the process of sending
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full bg-celestialblue text-white border border-black hover:bg-frenchblue" size="lg" disabled={pending} type="submit">
      {pending ? "Sending..." : "Send"}
    </Button>
  );
}
