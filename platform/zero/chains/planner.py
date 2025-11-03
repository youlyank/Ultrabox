"""
Planner chain for analyzing user requirements and creating project specifications.
"""
import json
import re
from typing import Dict, List, Any
import subprocess
import os

class ProjectPlanner:
    def __init__(self, ollama_base_url: str = "http://localhost:11434"):
        self.ollama_base_url = ollama_base_url
        self.model = "codellama:13b-instruct"
    
    def analyze_requirements(self, prompt: str) -> Dict[str, Any]:
        """Analyze user requirements and create project specification."""
        
        # Enhanced prompt for better analysis
        enhanced_prompt = f"""
        Analyze this user request and generate a complete project specification:
        
        User Request: "{prompt}"
        
        Consider:
        1. What type of application is this?
        2. What features are needed?
        3. What technology stack would be best?
        4. What infrastructure requirements?
        5. What database is appropriate?
        6. What testing strategy?
        
        Return ONLY valid JSON following this exact schema:
        {{
            "stack": "nextjs|go|rust|python",
            "features": ["auth", "payments", "realtime", "database", "api", "frontend", "testing"],
            "infra": "docker|k8s|serverless",
            "db": "postgres|sqlite|distributed|mongodb",
            "tests": "jest|pytest|go-test",
            "project_name": "descriptive-project-name",
            "description": "Brief description of the project",
            "complexity": "simple|medium|complex",
            "estimated_files": 10
        }}
        """
        
        try:
            response = self._call_ollama(enhanced_prompt)
            return self._parse_json_response(response)
        except Exception as e:
            print(f"Error in planning: {e}")
            return self._get_fallback_plan(prompt)
    
    def _call_ollama(self, prompt: str) -> str:
        """Call Ollama API for LLM inference."""
        cmd = [
            "curl", "-s", f"{self.ollama_base_url}/api/generate",
            "-d", json.dumps({
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "top_p": 0.9,
                    "max_tokens": 1000
                }
            })
        ]
        
        try:
            result = subprocess.check_output(cmd, text=True)
            response_data = json.loads(result)
            return response_data.get("response", "")
        except Exception as e:
            print(f"Error calling Ollama: {e}")
            raise
    
    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Parse and validate JSON response from LLM."""
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if not json_match:
            raise ValueError("No JSON found in response")
        
        try:
            plan = json.loads(json_match.group())
            return self._validate_plan(plan)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON: {e}")
            raise
    
    def _validate_plan(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and sanitize the plan."""
        required_fields = ["stack", "features", "infra", "db", "tests", "project_name", "description"]
        
        for field in required_fields:
            if field not in plan:
                plan[field] = self._get_default_value(field)
        
        # Ensure valid values
        plan["stack"] = plan.get("stack", "nextjs")
        plan["infra"] = plan.get("infra", "docker")
        plan["db"] = plan.get("db", "sqlite")
        plan["tests"] = plan.get("tests", "jest")
        
        return plan
    
    def _get_default_value(self, field: str) -> Any:
        """Get default values for missing fields."""
        defaults = {
            "stack": "nextjs",
            "features": ["frontend", "database"],
            "infra": "docker",
            "db": "sqlite",
            "tests": "jest",
            "project_name": "my-app",
            "description": "A generated application",
            "complexity": "simple",
            "estimated_files": 10
        }
        return defaults.get(field, "")
    
    def _get_fallback_plan(self, prompt: str) -> Dict[str, Any]:
        """Fallback plan when LLM fails."""
        # Simple keyword-based analysis
        prompt_lower = prompt.lower()
        
        if any(word in prompt_lower for word in ["web", "website", "frontend", "ui"]):
            stack = "nextjs"
        elif any(word in prompt_lower for word in ["api", "backend", "service"]):
            stack = "go"
        elif any(word in prompt_lower for word in ["ml", "ai", "data"]):
            stack = "python"
        else:
            stack = "nextjs"
        
        features = []
        if "auth" in prompt_lower or "login" in prompt_lower:
            features.append("auth")
        if "payment" in prompt_lower or "stripe" in prompt_lower:
            features.append("payments")
        if "real" in prompt_lower or "live" in prompt_lower:
            features.append("realtime")
        
        if not features:
            features = ["frontend", "database"]
        
        return {
            "stack": stack,
            "features": features,
            "infra": "docker",
            "db": "sqlite",
            "tests": "jest" if stack == "nextjs" else "pytest",
            "project_name": "generated-app",
            "description": f"Generated {stack} application based on: {prompt[:100]}...",
            "complexity": "simple",
            "estimated_files": 10
        }