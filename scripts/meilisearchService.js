import { defineCommand, runMain } from "citty";
import { execSync } from "child_process";

let env = 'development';
const CONTAINER_PROVIDERS = ["docker", "podman"]; // add more if needed
const MEILISEARCH_VOLUME = "rearyard-meilisearch-data-" + env;
const MEILISEARCH_IMAGE = "getmeili/meilisearch:latest";
const MEILISEARCH_CONTAINER_NAME = "rearyard-meilisearch-" + env;
const MEILISEARCH_PORT = 7700;
const MEILISEARCH_HOST = "127.0.0.1";

let containerProvider = getContainerProvider();

const COMMANDS = {
    CHECK_CONTAINER_EXISTS: `${containerProvider} ps -a -f name=${MEILISEARCH_CONTAINER_NAME} --format="{{.ID}}"`,
    CHECK_CONTAINER_STATUS: `${containerProvider} ps -a -f name=${MEILISEARCH_CONTAINER_NAME} --format="{{.Status}}"`,
    CHECK_VOLUME_EXISTS: `${containerProvider} volume ls -f name=${MEILISEARCH_VOLUME} --format="{{.Name}}"`,
    CREATE_VOLUME: `${containerProvider} volume create ${MEILISEARCH_VOLUME}`,
    REMOVE_VOLUME: `${containerProvider} volume rm ${MEILISEARCH_VOLUME}`,
    START_CONTAINER: `${containerProvider} start ${MEILISEARCH_CONTAINER_NAME}`,
    STOP_CONTAINER: `${containerProvider} stop ${MEILISEARCH_CONTAINER_NAME}`,
    RESTART_CONTAINER: `${containerProvider} restart ${MEILISEARCH_CONTAINER_NAME}`,
    REMOVE_CONTAINER: `${containerProvider} rm -f ${MEILISEARCH_CONTAINER_NAME}`,
    RUN_CONTAINER: `${containerProvider} run -d --name ${MEILISEARCH_CONTAINER_NAME} -p ${MEILISEARCH_HOST}:${MEILISEARCH_PORT}:${MEILISEARCH_PORT} -v ${MEILISEARCH_VOLUME}:/meili_data ${MEILISEARCH_IMAGE}`,
}

function getContainerProvider() {
    for (const provider of CONTAINER_PROVIDERS) {
        try {
            const command = execSync(`which ${provider}`);
            if (command) {
                return provider;
            }
        } catch (e) {
            continue;
        }
    }
}

function executeCommand(command) {
    return execSync(command).toString().trim();
}

const startMeilisearchService = async () => {
    const exists = executeCommand(COMMANDS.CHECK_CONTAINER_EXISTS);
    const status = executeCommand(COMMANDS.CHECK_CONTAINER_STATUS);
    const volumeExists = executeCommand(COMMANDS.CHECK_VOLUME_EXISTS);
    if (!volumeExists) {
        executeCommand(COMMANDS.CREATE_VOLUME);
    }
    if (exists && status.includes("Up")) {
        console.info("Meilisearch service already running");
        return;
    } else if (exists) {
        executeCommand(COMMANDS.START_CONTAINER);
    } else {
        executeCommand(COMMANDS.RUN_CONTAINER);
    }
    console.info("Meilisearch service started");
}

const stopMeilisearchService = async () => {
    executeCommand(COMMANDS.STOP_CONTAINER);
    console.info("Meilisearch service stopped");
}

const resetMeilisearchService = async () => {
    executeCommand(COMMANDS.CHECK_CONTAINER_EXISTS) && executeCommand(COMMANDS.STOP_CONTAINER);
    executeCommand(COMMANDS.CHECK_CONTAINER_EXISTS) && executeCommand(COMMANDS.REMOVE_CONTAINER);
    executeCommand(COMMANDS.CHECK_VOLUME_EXISTS) && executeCommand(COMMANDS.REMOVE_VOLUME);
    executeCommand(COMMANDS.CREATE_VOLUME);
    executeCommand(COMMANDS.RUN_CONTAINER);
    console.info("Meilisearch service reset");
}

const statusMeilisearchService = async () => {
    const exists = executeCommand(COMMANDS.CHECK_CONTAINER_EXISTS);
    const status = executeCommand(COMMANDS.CHECK_CONTAINER_STATUS);
    if (exists) {
        console.info(`Meilisearch service ${status.includes("Up") ? "running" : "stopped"}`);
    } else {
        console.info("Meilisearch service not found");
    }
}

const meilisearchService = defineCommand({
    meta: {
        version: "0.0.1",
        name: "Rearyard Meilisearch Service",
        description: "Rearyard Meilisearch Service manager",
    },
    subCommands: {
        start: {
            description: "Start the Meilisearch service",
            run: startMeilisearchService,
        },
        stop: {
            description: "Stop the Meilisearch service",
            run: stopMeilisearchService,
        },
        reset: {
            description: "Reset the Meilisearch service",
            run: resetMeilisearchService,
        },
        status: {
            description: "Get the status of the Meilisearch service",
            run: statusMeilisearchService,
        },
    },
    args: {
        env: {
            type: "string",
            description: "The environment to use",
            default: "development",
        },
    },
    setup: async () => {
        if (!containerProvider) {
            console.error("No container provider found, please install docker or podman");
            process.exit(1);
        }
    },
});

runMain(meilisearchService);
