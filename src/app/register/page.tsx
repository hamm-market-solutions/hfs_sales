import register from "@/actions/register";
import Button from "../components/button";
import Input from "../components/input";

export default function Register() {
    return <div className="flex flex-col">
        <h2 className="text-xl font-medium">Register</h2>
        <br />
        <form action={register} className="flex flex-col gap-1">
            <Input type="email" name="email" id="email" placeholder="E-Mail" className="p-1" />
            <Input type="password" name="password" id="password" placeholder="Password" className="p-1" />
            <Input type="password" name="password" id="password" placeholder="Repeat Password" className="p-1" />
            <Button type="submit" value="Login">Submit</Button>
        </form>
    </div>;
}
