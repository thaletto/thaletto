import { Link } from "@tanstack/react-router";
// import { ModeToggle } from "./theme-toggle";

export default function Header() {
    return (
        <div className="flex justify-between p-2">
            <div>
                {/*<ModeToggle />*/}
            </div>
            <div className="flex space-x-2">
                <Link to="/">About</Link>
                <p>&bull;</p>
                <Link to="/projects">Projects</Link>
                <p>&bull;</p>
                <Link to="/blogs">Writings</Link>
            </div>
        </div>
    )
}