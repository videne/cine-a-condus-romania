import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Pentru GitHub Pages, base-ul ar trebui sa fie numele repo-ului.
// Daca urci la https://USERNAME.github.io/cine-a-condus-romania/
// lasa base: './' ca sa functioneze oriunde (inclusiv local si pe orice subpath).
export default defineConfig({
  plugins: [react()],
  base: './',
})
