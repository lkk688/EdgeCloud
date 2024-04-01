// new update Mar 19
package main

import (
	"bufio"
	"bytes"
	"fmt"
	"log"
	"strings"

	"os"
	"os/exec"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type DockerImage struct {
	DockerHubImage string `json:"dockerHubImage"`
	AppName        string `json:"appName"`
	Replicas       string `json:"replicas"`
	Command        string `json:"command"`
}

type GithubPodCreation struct {
	GithubUrl        string `json:"githubUrl"`
	ExecutionCommand string `json:"executionCommand"`
}

type LocalContainer struct {
	ContainerLocation string `json:"containerLocation"`
	AppName           string `json:"appName"`
	Replicas          string `json:"noOfReps"`
	Command           string `json:"trigCmd"`
}

type CodeFiles struct {
	BaseImage                 string `json:"baseImage"`
	RequirementsTxtPath       string `json:"requirementsTxtPath"`
	ApplicationCodeFolderPath string `json:"applicationCodeFolderPath"`
	TriggerCmd                string `json:"triggerCmd"`
}

func generateDockerfile(baseImage, appLocation, requirementsFile, triggerCommand string) string {
	dockerfile := fmt.Sprintf(`
FROM %s

WORKDIR /app

COPY %s .

COPY %s .

pip install requirements.txt

# Specify the command to run on container start
CMD %s
`, baseImage, appLocation, requirementsFile, triggerCommand)

	return dockerfile
}

func saveDockerfile(dockerfile, saveLocation string) error {
	file, err := os.Create(saveLocation)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.WriteString(dockerfile)
	return err
}

type App struct {
	PodAppName string `json:"podAppName"`
}

func createPods(name string, fileLocation string, imageTag string, replicaCount int) {
	print("Yo: ", imageTag)
	// imageTag = "sarvagya23/mnist-fix:1.0"
	servicePort := "5000" // Set your desired service port here

	// Generate unique timestamp
	timestamp := time.Now().Format("20060102150405")

	// Append timestamp for uniqueness
	deploymentName := fmt.Sprintf("%s-deployment-%s", name, timestamp)
	serviceName := fmt.Sprintf("%s-service-%s", name, timestamp)
	name = fmt.Sprintf("%s-%s", name, timestamp)
	// Pull Docker image
	dockerImage := fmt.Sprintf("%s", imageTag)
	pullCmd := exec.Command("docker", "pull", dockerImage)
	pullCmd.Stdout = os.Stdout
	pullCmd.Stderr = os.Stderr
	fmt.Println("Pulling Docker image...")
	if err := pullCmd.Run(); err != nil {
		log.Fatalf("Failed to pull Docker image: %s", err)
	}

	// Generate deployment YAML
	deploymentYAML := []byte(fmt.Sprintf(`
apiVersion: apps/v1
kind: Deployment
metadata:
  name: %s
spec:
  replicas: %d
  selector:
    matchLabels:
      app: %s
  template:
    metadata:
      labels:
        app: %s
    spec:
      containers:
      - name: mnist-data
        image: %s
        command: ["python", "%s"]
`, deploymentName, replicaCount, name, name, dockerImage, fileLocation))

	deploymentFile := "deployment.yaml"
	if err := os.WriteFile(deploymentFile, deploymentYAML, 0644); err != nil {
		log.Fatalf("Failed to create deployment YAML file: %s", err)
	}
	fmt.Printf("Created %s\n", deploymentFile)

	// Generate service YAML
	serviceYAML := []byte(fmt.Sprintf(`
apiVersion: v1
kind: Service
metadata:
  name: %s
spec:
  selector:
    app: %s
  ports:
  - protocol: TCP
    port: %s
    targetPort: %s
`, serviceName, name, servicePort, servicePort))

	serviceFile := "service.yaml"
	if err := os.WriteFile(serviceFile, serviceYAML, 0644); err != nil {
		log.Fatalf("Failed to create service YAML file: %s", err)
	}
	fmt.Printf("Created %s\n", serviceFile)

	// Apply deployment and service YAML using kubectl
	fmt.Println("Applying deployment and service to Kubernetes cluster...")
	applyDeploymentCmd := exec.Command("kubectl", "apply", "-f", deploymentFile)
	applyDeploymentCmd.Stdout = os.Stdout
	applyDeploymentCmd.Stderr = os.Stderr
	if err := applyDeploymentCmd.Run(); err != nil {
		log.Fatalf("Failed to apply deployment: %s", err)
	}

	applyServiceCmd := exec.Command("kubectl", "apply", "-f", serviceFile)
	applyServiceCmd.Stdout = os.Stdout
	applyServiceCmd.Stderr = os.Stderr
	if err := applyServiceCmd.Run(); err != nil {
		log.Fatalf("Failed to apply service: %s", err)
	}

	fmt.Println("Deployment and service applied successfully!")
}

func main() {
	fmt.Print("Hello GO back-end")

	app := fiber.New()

	// dockerImage := DockerImage{}

	app.Use(cors.New())

	//health check endpoint
	app.Get("/healthCheck", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	//post for dockerhub image
	app.Post("/dockerImageName", func(c *fiber.Ctx) error {
		var req DockerImage
		// dockerImage := &DockerImage{}

		if err := c.BodyParser(&req); err != nil {
			return err
		}

		dockerHubImage := req.DockerHubImage
		appName := req.AppName
		command := req.Command
		replicas, err := strconv.Atoi(req.Replicas)
		if err != nil {
			return err // Handle error if replicas cannot be converted to an integer
		}
		fmt.Println(dockerHubImage)
		fmt.Println(appName)
		fmt.Println(replicas)
		fmt.Println(command)

		// commenting below code for now
		createPods(appName, command, dockerHubImage, replicas)

		// all the pod creation logic goes here
		return c.JSON(fiber.Map{
			"success": true,
			"message": "created pods successfully",
		})
	})

	//sudo k3s kubectl delete deployment deployment-name (test-demo-suc-deployment-20240305121847)
	// sudo k3s kubectl delete svc sercive-name (test-demo-suc-service-20240305121847)
	app.Post("/deletePod", func(c *fiber.Ctx) error {
		var req App

		if err := c.BodyParser(&req); err != nil {
			return err
		}

		podAppName := req.PodAppName
		podAppNameNameWithDeployment := fmt.Sprintf("%s-deployment", podAppName)
		podAppNameNameWithService := fmt.Sprintf("%s-service", podAppName)
		fmt.Println(podAppNameNameWithService)

		// Command to execute
		// cmd := exec.Command("kubectl", "get", "deployments", "--no-headers")
		cmd_deployments := exec.Command("bash", "-c", "kubectl get deployments --no-headers | awk '{print $1}'")
		cmd_service := exec.Command("bash", "-c", "kubectl get svc --no-headers | awk '{print $1}'")
		output_deployment, err := cmd_deployments.Output()
		if err != nil {
			fmt.Println("Error running deployment command:", err)
			return err
		}

		output_svc, err := cmd_service.Output()
		if err != nil {
			fmt.Println("Error running svc command:", err)
			return err
		}
		////
		var actual_deployment_name string
		var actual_service_name string

		scanner := bufio.NewScanner(bytes.NewReader(output_deployment))
		var deployments []string
		for scanner.Scan() {
			line := scanner.Text()
			deployments = append(deployments, line) // Append each line to the deployments array
		}

		for _, deployment := range deployments {
			if strings.HasPrefix(deployment, podAppNameNameWithDeployment) {
				actual_deployment_name = deployment
				break
				//fmt.Printf("Deployment %s matches app name %s\n", deployment, appName)
			}

		}

		////
		scanner1 := bufio.NewScanner(bytes.NewReader(output_svc))
		var services []string
		for scanner1.Scan() {
			line := scanner1.Text()
			services = append(services, line) // Append each line to the deployments array
		}
		for _, service := range services {
			// fmt.Println(service)
			if strings.HasPrefix(service, podAppNameNameWithService) {
				actual_service_name = service
				break
			}

		}
		fmt.Println(actual_deployment_name)
		fmt.Println(actual_service_name)
		// fmt.Sprintf("echo %s | sudo -S kubectl delete deployment %s", password, deploymentName)
		var pass string
		pass = "test"
		cmd_delete_deployments := exec.Command("bash", "-c", fmt.Sprintf("echo %s | sudo k3s kubectl delete deployment %s", pass, actual_deployment_name))
		// fmt.Println("Command:", cmd_delete_deployments)
		cmd_delete_service := exec.Command("bash", "-c", fmt.Sprintf("echo %s | sudo k3s kubectl delete svc %s", pass, actual_service_name))
		output_delete_deployment, err := cmd_delete_deployments.Output()
		if err != nil {
			fmt.Println("Error unable to delete deployment:", output_delete_deployment, err)
			return err
		}
		output_delete_service, err := cmd_delete_service.Output()
		if err != nil {
			fmt.Println("Error unable to delete service :", output_delete_service, err)
			return err
		}
		return c.JSON(fiber.Map{
			"success": true,
			"message": "successfully deleted the pod",
		})
	})
	//post api for local container
	app.Post("/localContainer", func(c *fiber.Ctx) error {
		var req LocalContainer

		if err := c.BodyParser(&req); err != nil {
			return err
		}

		containerLocation := req.ContainerLocation
		appName := req.AppName
		replicas := req.Replicas
		command := req.Command
		fmt.Print(containerLocation)
		fmt.Print(appName)
		fmt.Print(replicas)
		fmt.Print(command)
		// all the pod creation logic goes here
		return c.JSON(fiber.Map{
			"success": true,
			"message": "able to pass data",
		})
	})

	//post
	app.Post("/githubPodDetails", func(c *fiber.Ctx) error {
		var req GithubPodCreation

		if err := c.BodyParser(&req); err != nil {
			return err
		}

		url := req.GithubUrl
		cmd := req.ExecutionCommand

		fmt.Print("called githubpoddetials post api")
		fmt.Print(url)
		fmt.Print(cmd)

		// createPod function will be called here

		// If the pod was created successfully, return a success response
		return c.JSON(fiber.Map{
			"success": true,
			"message": "able to pass data",
		})
	})

	app.Post("/codeFiles", func(c *fiber.Ctx) error {
		var req CodeFiles

		if err := c.BodyParser(&req); err != nil {
			return err
		}

		baseImage := req.BaseImage
		requirementsTxtPath := req.RequirementsTxtPath
		applicationCodeFolderPath := req.ApplicationCodeFolderPath
		triggerCmd := req.TriggerCmd
		// fmt.Println("here")
		fmt.Println(baseImage)
		fmt.Println(requirementsTxtPath)
		fmt.Println(applicationCodeFolderPath)
		fmt.Println(triggerCmd)

		// pod creation logic will come here
		dockerfile := generateDockerfile(baseImage, applicationCodeFolderPath, requirementsTxtPath, triggerCmd)

		// Specify the save location for the Dockerfile
		saveLocation := "/Users/suchandrabajjuri/Desktop/suchi/dockerfile"
		///Users/suchandrabajjuri/Desktop/suchi

		// Call saveDockerfile
		err := saveDockerfile(dockerfile, saveLocation)
		if err != nil {
			fmt.Println("Error saving Dockerfile:", err)
			os.Exit(1)
		}

		fmt.Println("created docker file in the given location")

		return c.JSON(fiber.Map{
			"success": true,
			"message": "able to pass data",
		})
	})

	// post upload file

	log.Fatal(app.Listen(":4001"))
}
