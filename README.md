# SmartMatch: Vector-Based Profile Matchmaking Engine

A high-performance, lightweight matching API built from scratch to demonstrate how linear algebra and distance geometry drive modern recommendation systems, semantic search, and vector databases. 

Instead of relying on high-level machine learning libraries, this project explicitly implements core mathematical metrics using raw vector transformations and matrix operations in **NumPy**, showing how production software engineering can seamlessly fuse with fundamental data science concepts.

---

## 🚀 Core Features

* **Matrix-Driven Computations:** Organizes thousands of distinct user profiles into a single 2D NumPy array, executing geometric algorithms across the entire population instantly via vectorization, completely eliminating slow Python `for` loops.
* **Multi-Metric Filtering Engine:** Features distinct API evaluation paths allowing clients to toggle between:
  * **Cosine Similarity:** Focuses strictly on the *ratio/pattern* of attributes (ideal for matching behavioral preferences, ignoring scale).
  * **Euclidean Distance:** Evaluates *absolute geometric proximity* (ideal for finding exact magnitude-for-magnitude matches).
* **Synthetic Population Generation:** Synthesizes large datasets dynamically upon server startup using the `Faker` library to populate user attributes (`[Coding Skill, Hourly Rate, Design Skill]`) for immediate stress-testing.
* **Production-Ready API Layers:** Encapsulated inside a high-speed, asynchronous **FastAPI** framework equipped with automatic interactive Swagger UI documentation.

---

## 🛠️ Tech Stack

* **Language:** Python 3
* **Math & Matrix Operations:** NumPy (Vectorization & Norm Operations)
* **Backend Framework:** FastAPI, Uvicorn, Pydantic
* **Data Simulation:** Faker

---

## 📂 Project Structure

```text
├── main.py              # Core FastAPI application & vector math engine
├── requirements.txt     # Third-party dependencies
└── README.md            # Project documentation
