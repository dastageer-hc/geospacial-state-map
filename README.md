
# Spatial Mapping Assessment UI

## 📌 What This Project Does
This is a **React + Leaflet** front-end application that uses the **Geoapify Boundaries API** to display the boundaries of Indian states on an interactive map.

With this app, you can:
- Search for any **Indian state**.
- See its **administrative boundary** highlighted as a polygon on the map.
- View a **marker** placed at the state's centroid with its name.
- Interact with the map (zoom, pan, click) for exploration.

---

## 🚀 How to Run the Project

### 1. Clone the Repo

```bash
git clone <your-repo-url>
cd <your-project-folder>




### 2. Install Dependencies
npm install



### 3. Get a Geoapify API Key
- Sign up at [https://www.geoapify.com/boundaries-api/](https://www.geoapify.com/boundaries-api/)
- Create a new project and get your API key.

### 4. Add Your API Key to `.env`
In your project root, create a file named `.env` and add:
VITE_GEOAPIFY_KEY=your_api_key_here


> If you use Create React App, use:
REACT_APP_GEOAPIFY_KEY=your_api_key_here


### 5. Start the Development Server
For Vite:
npm run dev


For Create React App:
npm start
```

---

✅ The app will open in your browser.
- Type a **state name** in the search bar.
- Select or press Enter.
- The map will **zoom, draw the polygon boundary**, and place a **marker** with the state name.

---