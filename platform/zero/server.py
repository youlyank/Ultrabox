"""
Ultra DevBox Zero-Code Builder API
FastAPI server for generating complete projects from natural language prompts.
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import subprocess
import tempfile
import zipfile
import shutil
import uuid
from typing import Dict, List, Optional
import logging
from datetime import datetime

from chains.planner import ProjectPlanner
from chains.codegen import CodeGenerator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Ultra DevBox Zero-Code Builder",
    description="AI-powered project generation API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
planner = None
generator = None
project_cache = {}

class PromptRequest(BaseModel):
    prompt: str
    stack: Optional[str] = None
    features: Optional[List[str]] = None

class ProjectResponse(BaseModel):
    project_id: str
    status: str
    message: str
    download_url: Optional[str] = None
    preview: Optional[Dict] = None

class ProjectStatus(BaseModel):
    project_id: str
    status: str
    progress: int
    message: str
    download_url: Optional[str] = None

# Initialize services
def init_services():
    global planner, generator
    ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    planner = ProjectPlanner(ollama_base_url)
    generator = CodeGenerator(ollama_base_url)
    logger.info(f"Services initialized with Ollama at {ollama_base_url}")

@app.on_event("startup")
async def startup_event():
    init_services()

@app.get("/")
async def root():
    return {
        "message": "Ultra DevBox Zero-Code Builder API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "generate": "/generate",
            "status": "/status/{project_id}",
            "download": "/download/{project_id}",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Check Ollama availability
        ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        result = subprocess.run(
            ["curl", "-s", f"{ollama_url}/api/tags"],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        ollama_status = "available" if result.returncode == 0 else "unavailable"
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "ollama": ollama_status,
                "planner": "available" if planner else "unavailable",
                "generator": "available" if generator else "unavailable"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
        )

@app.post("/generate", response_model=ProjectResponse)
async def generate_project(request: PromptRequest, background_tasks: BackgroundTasks):
    """Generate a complete project from a natural language prompt."""
    try:
        # Generate unique project ID
        project_id = str(uuid.uuid4())
        
        # Initialize project status
        project_cache[project_id] = {
            "status": "planning",
            "progress": 10,
            "message": "Analyzing requirements...",
            "created_at": datetime.now()
        }
        
        # Start generation in background
        background_tasks.add_task(
            generate_project_background,
            project_id,
            request.prompt,
            request.stack,
            request.features
        )
        
        return ProjectResponse(
            project_id=project_id,
            status="planning",
            message="Project generation started",
            preview={"project_id": project_id}
        )
        
    except Exception as e:
        logger.error(f"Failed to start project generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def generate_project_background(
    project_id: str,
    prompt: str,
    preferred_stack: Optional[str] = None,
    preferred_features: Optional[List[str]] = None
):
    """Background task for project generation."""
    try:
        # Update status: Planning
        project_cache[project_id].update({
            "status": "planning",
            "progress": 20,
            "message": "Creating project specification..."
        })
        
        # Step 1: Plan the project
        logger.info(f"Planning project {project_id}")
        plan = planner.analyze_requirements(prompt)
        
        # Apply user preferences if provided
        if preferred_stack:
            plan["stack"] = preferred_stack
        if preferred_features:
            plan["features"] = preferred_features
        
        # Update status: Generating
        project_cache[project_id].update({
            "status": "generating",
            "progress": 50,
            "message": f"Generating {plan['stack']} project...",
            "plan": plan
        })
        
        # Step 2: Generate code
        logger.info(f"Generating code for project {project_id}")
        temp_dir = tempfile.mkdtemp(prefix=f"ultrabox_{project_id}_")
        
        try:
            created_files = generator.generate_project(plan, temp_dir)
            
            # Update status: Packaging
            project_cache[project_id].update({
                "status": "packaging",
                "progress": 80,
                "message": "Creating project package...",
                "files_created": len(created_files)
            })
            
            # Step 3: Create zip file
            zip_filename = f"{plan['project_name']}_{project_id}.zip"
            zip_path = os.path.join("/tmp", zip_filename)
            
            shutil.make_archive(
                zip_path.replace(".zip", ""),
                "zip",
                temp_dir
            )
            
            # Update status: Complete
            project_cache[project_id].update({
                "status": "completed",
                "progress": 100,
                "message": "Project generated successfully!",
                "download_url": f"/download/{zip_filename}",
                "zip_path": zip_path,
                "plan": plan,
                "files_created": len(created_files),
                "completed_at": datetime.now()
            })
            
            logger.info(f"Project {project_id} generated successfully")
            
        finally:
            # Clean up temp directory
            shutil.rmtree(temp_dir, ignore_errors=True)
            
    except Exception as e:
        logger.error(f"Failed to generate project {project_id}: {e}")
        project_cache[project_id].update({
            "status": "failed",
            "progress": 0,
            "message": f"Generation failed: {str(e)}",
            "error": str(e),
            "failed_at": datetime.now()
        })

@app.get("/status/{project_id}", response_model=ProjectStatus)
async def get_project_status(project_id: str):
    """Get the status of a project generation."""
    if project_id not in project_cache:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = project_cache[project_id]
    
    return ProjectStatus(
        project_id=project_id,
        status=project["status"],
        progress=project["progress"],
        message=project["message"],
        download_url=project.get("download_url")
    )

@app.get("/download/{filename}")
async def download_project(filename: str):
    """Download a generated project."""
    # Find the project by filename
    project_id = None
    for pid, project in project_cache.items():
        if project.get("download_url") == f"/download/{filename}":
            project_id = pid
            break
    
    if not project_id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = project_cache[project_id]
    zip_path = project.get("zip_path")
    
    if not zip_path or not os.path.exists(zip_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=zip_path,
        filename=filename,
        media_type="application/zip"
    )

@app.get("/projects")
async def list_projects():
    """List all generated projects."""
    projects = []
    for project_id, project in project_cache.items():
        projects.append({
            "project_id": project_id,
            "status": project["status"],
            "progress": project["progress"],
            "message": project["message"],
            "created_at": project["created_at"],
            "plan": project.get("plan"),
            "files_created": project.get("files_created")
        })
    
    return {"projects": projects}

@app.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    """Delete a project and its files."""
    if project_id not in project_cache:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = project_cache[project_id]
    
    # Delete zip file if it exists
    zip_path = project.get("zip_path")
    if zip_path and os.path.exists(zip_path):
        os.remove(zip_path)
    
    # Remove from cache
    del project_cache[project_id]
    
    return {"message": "Project deleted successfully"}

@app.get("/stacks")
async def get_available_stacks():
    """Get available technology stacks."""
    return {
        "stacks": [
            {
                "id": "nextjs",
                "name": "Next.js",
                "description": "Modern React framework with TypeScript",
                "features": ["frontend", "api", "auth", "database"],
                "best_for": "Web applications, e-commerce, dashboards"
            },
            {
                "id": "go",
                "name": "Go",
                "description": "High-performance backend services",
                "features": ["api", "database", "realtime"],
                "best_for": "Microservices, APIs, CLI tools"
            },
            {
                "id": "python",
                "name": "Python",
                "description": "Versatile language for web and data",
                "features": ["api", "database", "ai", "testing"],
                "best_for": "Data science, AI/ML, rapid prototyping"
            },
            {
                "id": "rust",
                "name": "Rust",
                "description": "System programming with safety",
                "features": ["api", "performance", "testing"],
                "best_for": "Performance-critical applications, WebAssembly"
            }
        ]
    }

@app.get("/features")
async def get_available_features():
    """Get available features."""
    return {
        "features": [
            {
                "id": "auth",
                "name": "Authentication",
                "description": "User authentication and authorization",
                "compatible_stacks": ["nextjs", "go", "python"]
            },
            {
                "id": "payments",
                "name": "Payments",
                "description": "Payment processing with Stripe",
                "compatible_stacks": ["nextjs", "go", "python"]
            },
            {
                "id": "realtime",
                "name": "Real-time",
                "description": "WebSocket connections and live updates",
                "compatible_stacks": ["nextjs", "go", "python"]
            },
            {
                "id": "database",
                "name": "Database",
                "description": "Database integration and ORM",
                "compatible_stacks": ["nextjs", "go", "python", "rust"]
            },
            {
                "id": "api",
                "name": "API",
                "description": "RESTful API endpoints",
                "compatible_stacks": ["nextjs", "go", "python", "rust"]
            },
            {
                "id": "frontend",
                "name": "Frontend",
                "description": "React components and UI",
                "compatible_stacks": ["nextjs"]
            },
            {
                "id": "testing",
                "name": "Testing",
                "description": "Unit and integration tests",
                "compatible_stacks": ["nextjs", "go", "python", "rust"]
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    logger.info(f"Starting Ultra DevBox Zero-Code Builder API on {host}:{port}")
    uvicorn.run(app, host=host, port=port)