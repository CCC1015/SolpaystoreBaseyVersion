import { BrowserRouter, Routes, Route } from "react-router-dom"
import About from "./About";
import Contact from "./Contact";
import Home from "./Home";

export default function (){
return (
<div>
<BrowserRouter>
<Routes>
<Route index element={<Home />} />
<Route path="/home" element={<Home />} />
<Route path="/About" element={<About />} />
<Route path="/Contact" element={<Contact />} />
</Routes>
</BrowserRouter>
</div>
)

}