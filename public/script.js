document.getElementById("year").textContent = new Date().getFullYear();
const links=[...document.querySelectorAll(".nav a")];
const sections=[...document.querySelectorAll("main section[id]")];
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;links.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));}),{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(section=>observer.observe(section));
