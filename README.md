# Abu Dhabi Amenities Map

This is a small web mapping application built using **Leaflet.js**.  
It displays important public places in Abu Dhabi such as **Parks, Hospitals, and Libraries**, with data coming from an external **GeoJSON** file.

A simple **search box** is included — you can type queries like:

- “show parks”
- “find hospitals”
- “list libraries”

Based on your input, the map filters and only shows relevant locations.

---

## How It Works 

- The map loads an OpenStreetMap basemap and centers on Abu Dhabi.
- All point locations are stored separately in a `places.geojson` file.
- When the app starts, all features are shown on the map.
- The search bar uses basic text matching:
  - words like **park**, **hospital**, or **library** in your search
  - are used to filter the data and update the map
- Each location appears as a colored marker:
  - **Green** → Parks  
  - **Red** → Hospitals  
  - **Blue** → Libraries  
- Clicking a marker opens a popup showing the name and type of the place.

> The filtering is intentionally kept simple — it only looks for keywords in the text you type.


## Project Structure


Public Amenity Search Map/
├─ index.html      # Main HTML page
├─ style.css       # Map & search bar styling
├─ script.js       # Leaflet map & filtering logic
└─ places.geojson  # GeoJSON data (points in Abu Dhabi)




### How to Run

Since the app loads data using `fetch()`, you must run it through a **local server**.  
Opening `index.html` directly by double-clicking may not work in some browsers.

## Easiest Method 
# If using Visual Studio Code:

- Install the Live Server extension

- Right-click index.html

- Select “Open with Live Server”

- This will automatically open the map in your browser.
