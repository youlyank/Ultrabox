# Ultra DevBox Coder Template
# This template defines the infrastructure for Ultra DevBox workspaces

variable "coder_agent_token" {
  description = "The Coder agent token."
  sensitive   = true
}

variable "coder_agent_name" {
  description = "The name of the Coder agent."
  type        = string
  default     = "ultra-devbox-agent"
}

variable "repo_url" {
  description = "GitHub repository URL to clone."
  type        = string
  default     = "https://github.com/ultra-devbox/starter-template"
}

variable "cpu" {
  description = "CPU cores allocated to the workspace."
  type        = number
  default     = 2
  validation {
    condition = contains([1, 2, 4, 8], var.cpu)
    error_message = "CPU must be one of: 1, 2, 4, 8."
  }
}

variable "memory" {
  description = "Memory in GB allocated to the workspace."
  type        = number
  default     = 4
  validation {
    condition = contains([2, 4, 8, 16, 32], var.memory)
    error_message = "Memory must be one of: 2, 4, 8, 16, 32."
  }
}

variable "disk" {
  description = "Disk size in GB."
  type        = number
  default     = 20
}

variable "gpu" {
  description = "GPU model (optional)."
  type        = string
  default     = ""
}

variable "llm_model" {
  description = "LLM model to use."
  type        = string
  default     = "codellama:13b-instruct"
  validation {
    condition = contains([
      "codellama:13b-instruct",
      "codellama:34b-instruct",
      "starcoder:15b",
      "wizardcoder:15b"
    ], var.llm_model)
    error_message = "LLM model must be one of the supported models."
  }
}

variable "enable_docker" {
  description = "Enable Docker-in-Docker support."
  type        = bool
  default     = true
}

variable "enable_k8s" {
  description = "Enable Kubernetes tools."
  type        = bool
  default     = false
}

variable "billing_tier" {
  description = "Billing tier for resource allocation."
  type        = string
  default     = "starter"
  validation {
    condition = contains(["starter", "pro", "enterprise"], var.billing_tier)
    error_message = "Billing tier must be one of: starter, pro, enterprise."
  }
}

locals {
  # Resource allocation based on billing tier
  tier_resources = {
    starter = {
      cpu    = 2
      memory = 4
      disk   = 20
      gpu    = ""
    }
    pro = {
      cpu    = 4
      memory = 8
      disk   = 50
      gpu    = "nvidia-tesla-t4"
    }
    enterprise = {
      cpu    = 8
      memory = 16
      disk   = 100
      gpu    = "nvidia-tesla-v100"
    }
  }
  
  # Use tier-specific resources if not overridden
  actual_cpu    = var.billing_tier != "custom" ? local.tier_resources[var.billing_tier].cpu : var.cpu
  actual_memory = var.billing_tier != "custom" ? local.tier_resources[var.billing_tier].memory : var.memory
  actual_disk   = var.billing_tier != "custom" ? local.tier_resources[var.billing_tier].disk : var.disk
  actual_gpu    = var.billing_tier != "custom" ? local.tier_resources[var.billing_tier].gpu : var.gpu
}

resource "coder_agent" "main" {
  arch           = "amd64"
  os             = "linux"
  dir            = "/home/coder"
  display_name   = var.coder_agent_name
  token          = var.coder_agent_token
  connection {
    type = "direct"
  }
}

resource "coder_app" "vscode" {
  agent_id     = coder_agent.main.id
  display_name = "VS Code"
  icon         = "/icon/vscode.svg"
  url          = "http://localhost:8080"
  description  = "Full VS Code experience in your browser"
}

resource "coder_app" "ollama" {
  agent_id     = coder_agent.main.id
  display_name = "Ollama AI"
  icon         = "/icon/terminal.svg"
  url          = "http://localhost:11434"
  description  = "AI-powered code completion and chat"
}

resource "coder_app" "terminal" {
  agent_id     = coder_agent.main.id
  display_name = "Terminal"
  icon         = "/icon/terminal.svg"
  url          = "https://${coder_agent.main.name}.${coder_workspace.owner}.${coder_workspace.access_url}"
  description  = "Direct terminal access to your workspace"
}

resource "coder_env" "workspace_info" {
  agent_id = coder_agent.main.id
  name     = "ULTRA_DEVBOX_INFO"
  value    = jsonencode({
    cpu        = local.actual_cpu
    memory     = local.actual_memory
    disk       = local.actual_disk
    gpu        = local.actual_gpu
    llm_model  = var.llm_model
    tier       = var.billing_tier
    docker     = var.enable_docker
    k8s        = var.enable_k8s
  })
}

resource "coder_env" "git_config" {
  count    = var.repo_url != "" ? 1 : 0
  agent_id = coder_agent.main.id
  name     = "GIT_REPO_URL"
  value    = var.repo_url
}

resource "coder_env" "llm_config" {
  agent_id = coder_agent.main.id
  name     = "OLLAMA_MODEL"
  value    = var.llm_model
}

# Docker-in-Docker support
resource "coder_agent_dependency" "docker" {
  count = var.enable_docker ? 1 : 0
  agent_id = coder_agent.main.id
  
  docker {
    image = "docker:dind"
    run_args = [
      "--privileged",
      "--network=host",
      "-v", "/var/run/docker.sock:/var/run/docker.sock"
    ]
  }
}

# Kubernetes tools
resource "coder_agent_dependency" "k8s_tools" {
  count = var.enable_k8s ? 1 : 0
  agent_id = coder_agent.main.id
  
  docker {
    image = "bitnami/kubectl:latest"
  }
}

# Main workspace container
resource "coder_agent_dependency" "workspace" {
  agent_id = coder_agent.main.id
  
  docker {
    image = "ultra-devbox/workspace:latest"
    run_args = [
      "--cap-add=SYS_PTRACE",
      "--security-opt", "seccomp=unconfined",
      "-p", "8080:8080",  # VS Code
      "-p", "11434:11434", # Ollama
      "-p", "3000:3000",  # App ports
      "-v", "/var/run/docker.sock:/var/run/docker.sock"
    ]
    env = {
      "CODER_AGENT_TOKEN" = var.coder_agent_token
      "OLLAMA_MODEL"      = var.llm_model
      "WORKSPACE_CPU"     = tostring(local.actual_cpu)
      "WORKSPACE_MEMORY"  = tostring(local.actual_memory)
      "BILLING_TIER"      = var.billing_tier
    }
  }
}

# Startup script
resource "coder_script" "setup" {
  agent_id = coder_agent.main.id
  display_name = "Ultra DevBox Setup"
  icon         = "/icon/terminal.svg"
  run_on_start = true
  
  script = <<-EOT
#!/bin/bash

echo "🚀 Initializing Ultra DevBox workspace..."

# Set environment variables
export OLLAMA_HOST=http://localhost:11434
export WORKSPACE_DIR=/home/coder/workspace
export ULTRA_DEVBOX=true

# Start Ollama service
echo "🤖 Starting Ollama service..."
ollama serve &
sleep 5

# Pull LLM model if not exists
echo "📥 Ensuring LLM model is available..."
if ! ollama list | grep -q "${var.llm_model}"; then
    echo "Pulling ${var.llm_model} model..."
    ollama pull ${var.llm_model}
fi

# Clone repository if provided
if [ -n "$GIT_REPO_URL" ]; then
    echo "📥 Cloning repository: $GIT_REPO_URL"
    cd /home/coder/workspace/projects
    git clone $GIT_REPO_URL
fi

# Start VS Code Server
echo "💻 Starting VS Code Server..."
code-server --bind-addr 0.0.0.0:8080 --auth none --disable-telemetry &

echo "✅ Ultra DevBox ready!"
echo "📱 VS Code: http://localhost:8080"
echo "🤖 Ollama: http://localhost:11434"
echo "📁 Workspace: /home/coder/workspace"

# Display workspace info
echo ""
echo "📊 Workspace Configuration:"
echo "   CPU: ${local.actual_cpu} cores"
echo "   Memory: ${local.actual_memory} GB"
echo "   Disk: ${local.actual_disk} GB"
echo "   GPU: ${local.actual_gpu != "" ? local.actual_gpu : "None"}"
echo "   LLM Model: ${var.llm_model}"
echo "   Billing Tier: ${var.billing_tier}"
echo ""
EOT
}

# Resource monitoring
resource "coder_script" "monitor" {
  agent_id = coder_agent.main.id
  display_name = "Resource Monitor"
  icon         = "/icon/dashboard.svg"
  run_on_start = true
  
  script = <<-EOT
#!/bin/bash

# Monitor resource usage
while true; do
    echo "=== Resource Usage ==="
    echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)"
    echo "Memory: $(free -h | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
    echo "Disk: $(df -h /home/coder | awk 'NR==2{print $5}')"
    echo "====================="
    sleep 60
done
EOT
}