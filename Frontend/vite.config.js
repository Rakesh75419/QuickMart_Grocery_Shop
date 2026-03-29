import {defineConfig} from "vite";

export default defineConfig({
    root:".",
    server:{
        port:7777,
        open:true    
    },

    build:{
        outDir:"dist"
    }
})