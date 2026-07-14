import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from faker import Faker
import random

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SmartMatch Vector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
fake = Faker()


NUM_PROFILES = 1000
freelancer_names = [fake.name() for _ in range(NUM_PROFILES)]
freelancer_matrix = np.array([[round(random.uniform(1, 10), 1) for _ in range(3)] for _ in range(NUM_PROFILES)])

class MatchRequest(BaseModel):
    target: List[float]

@app.post("/match")
def get_matches(request: MatchRequest, metric: str = "cosine"):
    target_vector = np.array(request.target)
    
    if target_vector.shape[0] != 3:
        raise HTTPException(status_code=400, detail="Vector values 3 must be in order: [Coding, Price, Design]")
    
  
    if metric == "cosine":
        dot_product = freelancer_matrix @ target_vector
        matrix_norms = np.linalg.norm(freelancer_matrix, axis=1)
        target_norm = np.linalg.norm(target_vector)
        
        matrix_norms[matrix_norms == 0] = 1e-9
        scores = dot_product / (matrix_norms * (target_norm if target_norm != 0 else 1e-9))
        sorted_indices = np.argsort(scores)[::-1]
        
   
    elif metric == "euclidean":
        scores = np.sqrt(np.sum((freelancer_matrix - target_vector) ** 2, axis=1))
        sorted_indices = np.argsort(scores) 
        
    else:
        raise HTTPException(status_code=400, detail="Invalid metric. Choose 'cosine' or 'euclidean'")

    results = []
    for idx in sorted_indices[:5]:
        results.append({
            "name": freelancer_names[idx],
            "profile_vector": freelancer_matrix[idx].tolist(),
            "score": float(scores[idx])
        })
        
    return {"metric_used": metric, "matches": results}