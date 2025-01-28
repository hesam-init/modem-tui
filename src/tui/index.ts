import { HilinkHttpService } from "@/services/hilink/http.services";
import { formatBytes } from "@/utils/format-bytes";
import blessed from "blessed";
import contrib, { type Widgets } from "blessed-contrib";

export class Dashboard {
	private refreshRate = 100;
	private grid: contrib.grid;
	private screen: blessed.Widgets.Screen;

	private hilinkService: HilinkHttpService;

	private donut!: contrib.Widgets.DonutElement;
	private gauge!: contrib.Widgets.GaugeElement;
	private gaugeTwo!: contrib.Widgets.GaugeElement;
	private sparkline!: contrib.Widgets.SparklineElement;
	private bar!: contrib.Widgets.BarElement;
	private table!: contrib.Widgets.TableElement;
	private lcdLineOne!: contrib.Widgets.LcdElement;
	private errorsLine!: contrib.Widgets.LineElement;
	private informationBox!: blessed.Widgets.BoxElement;
	private log!: contrib.Widgets.LogElement;
	private logBox!: blessed.Widgets.BoxElement;
	private networkUsage!: contrib.Widgets.LineElement;

	private servers: string[] = ["US1", "US2", "EU1", "AU1", "AS1", "JP1"];
	private commands: string[] = ["node", "timer", "~/ls -l", "awk"];

	constructor() {
		this.hilinkService = new HilinkHttpService();

		this.screen = blessed.screen({
			fastCSR: true,
		});
		this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen });

		this.initializeWidgets();
		this.setupEventListeners();
		this.startDataUpdates();
	}

	public async render() {
		await this.hilinkService.start();
		await this.hilinkService.getStateLogin();

		// setInterval(() => {
		// 	this.screen.render();
		// }, this.refreshRate);
	}

	public async refresh() {
		this.screen.render();
	}

	private initializeWidgets(): void {
		this.networkUsage = this.grid.set(0, 0, 6, 6, contrib.line, {
			// showNthLabel: 5,
			maxY: 10000000,
			label: "Network Usage",
			showLegend: true,
			legend: { width: 26 },
		} as Widgets.LineOptions);

		this.donut = this.grid.set(8, 8, 4, 2, contrib.donut, {
			label: "Percent Donut",
			radius: 16,
			arcWidth: 4,
			yPadding: 2,
			data: [{ label: "Storage", percent: 87 }],
		});

		this.gauge = this.grid.set(8, 10, 2, 2, contrib.gauge, {
			label: "Storage",
			percent: [80, 20],
		});

		this.gaugeTwo = this.grid.set(2, 9, 2, 3, contrib.gauge, {
			label: "Deployment Progress",
			percent: 80,
		});

		this.sparkline = this.grid.set(10, 10, 2, 2, contrib.sparkline, {
			label: "Throughput (bits/sec)",
			tags: true,
			style: { fg: "blue", titleFg: "white" },
		});

		this.bar = this.grid.set(4, 6, 4, 3, contrib.bar, {
			label: "Server Utilization (%)",
			barWidth: 4,
			barSpacing: 6,
			xOffset: 2,
			maxHeight: 9,
		});

		this.table = this.grid.set(4, 9, 4, 3, contrib.table, {
			keys: true,
			fg: "green",
			label: "Active Processes",
			columnSpacing: 1,
			columnWidth: [24, 10, 10],
		});

		this.errorsLine = this.grid.set(0, 6, 4, 3, contrib.line, {
			style: { line: "red", text: "white", baseline: "black" },
			label: "Errors Rate",
			maxY: 60,
			showLegend: true,
		});

		this.log = this.grid.set(8, 6, 4, 2, contrib.log, {
			fg: "green",
			selectedFg: "green",
			label: "Server Log",
		});

		this.logBox = this.grid.set(6, 0, 6, 6, blessed.box, {
			label: "Consol Log",
			content: "Hello {bold}world{/bold}!",
			tags: true,
			border: {
				type: "line",
			},
			style: {
				fg: "white",
				bg: "magenta",
				border: {
					fg: "#f0f0f0",
				},
				hover: {
					bg: "green",
				},
			},
		});

		this.grid.set(0, 9, 2, 3, blessed.box, {
			label: "Cool",
			content: "Hello {bold}world{/bold}!",
			tags: true,
			border: {
				type: "line",
			},
			style: {
				hover: {
					bg: "green",
				},
			},
		});
	}

	private setupEventListeners(): void {
		this.screen.key(["escape", "q", "C-c"], () => process.exit(0));

		this.screen.on("resize", () => {
			this.donut.emit("attach");
			this.gauge.emit("attach");
			this.gaugeTwo.emit("attach");
			this.sparkline.emit("attach");
			this.bar.emit("attach");
			this.table.emit("attach");
			// this.lcdLineOne.emit("attach");
			this.errorsLine.emit("attach");
			this.networkUsage.emit("attach");
			// this.informationBox.emit("attach");
			this.log.emit("attach");
		});
	}

	private startDataUpdates(): void {
		this.updateBarChart();
		this.updateNetworkUsage();
		this.updateLogBox();

		this.updateGauges();
		this.updateTable();
		this.updateLog();
		this.updateSparkline();
		// this.updateLCD();
		this.updateDonut();
	}

	private async updateLogBox() {
		setInterval(async () => {
			const networkStats = await this.hilinkService.getTrafficStatistics();

			this.logBox.setContent(`${JSON.stringify(networkStats.data).toString()}`);
		}, 100);
	}

	private async updateNetworkUsage(): Promise<void> {
		const downloadRateData: Widgets.LineData = {
			title: "Download Rate",
			style: { line: "blue" },
			x: Array.from({ length: 30 }, (_, i) => "-"),
			y: Array.from({ length: 30 }, () => 0),
		};

		const uploadRateData: Widgets.LineData = {
			title: "Upload Rate",
			style: { line: "red" },
			x: Array.from({ length: 30 }, (_, i) => "-"),
			y: Array.from({ length: 30 }, () => 0),
		};

		const updateNetworkUsageData = async () => {
			const networkStats = await this.hilinkService.getTrafficStatistics();

			downloadRateData.y?.shift();
			downloadRateData.title = `Download Rate ${formatBytes(networkStats.data?.CurrentDownloadRate || 0)}`;
			downloadRateData.y?.push(networkStats.data?.CurrentDownloadRate || 0);

			uploadRateData.y?.shift();
			uploadRateData.title = `Upload Rate ${formatBytes(networkStats.data?.CurrentUploadRate || 0)}`;
			uploadRateData.y?.push(networkStats.data?.CurrentUploadRate || 0);
		};

		setInterval(() => {
			updateNetworkUsageData();

			this.networkUsage.setData([uploadRateData, downloadRateData]);

			this.refresh();
		}, 50);
	}

	private updateGauges(): void {
		let gaugePercent = 0;
		setInterval(() => {
			this.gauge.setData([gaugePercent, 100 - gaugePercent]);
			gaugePercent = (gaugePercent + 1) % 100;
		}, 200);

		let gaugeTwoPercent = 0;
		setInterval(() => {
			this.gaugeTwo.setData(gaugeTwoPercent);
			gaugeTwoPercent = (gaugeTwoPercent + 1) % 100;
		}, 200);
	}

	private updateBarChart(): void {
		const fillBar = () => {
			const data = this.servers.map(() => Math.round(Math.random() * 10));
			this.bar.setData({ titles: this.servers, data });
		};

		fillBar();
		setInterval(fillBar, 2000);
	}

	private updateTable(): void {
		const generateTable = () => {
			const data = Array.from({ length: 30 }, () => [
				this.commands[Math.floor(Math.random() * this.commands.length)],
				Math.round(Math.random() * 5),
				Math.round(Math.random() * 100),
			]);

			this.table.setData({ headers: ["Process", "Cpu (%)", "Memory"], data });
		};

		generateTable();
		this.table.focus();
		setInterval(generateTable, 3000);
	}

	private updateLog(): void {
		setInterval(() => {
			const rnd = Math.floor(Math.random() * 3);
			if (rnd === 0) {
				this.log.log(
					`starting process ${this.commands[Math.floor(Math.random() * this.commands.length)]}`
				);
			} else if (rnd === 1) {
				this.log.log(
					`terminating server ${this.servers[Math.floor(Math.random() * this.servers.length)]}`
				);
			} else if (rnd === 2) {
				this.log.log(`avg. wait time ${Math.random().toFixed(2)}`);
			}
			this.screen.render();
		}, 500);
	}

	private updateSparkline(): void {
		const spark1 = Array.from(
			{ length: 36 },
			() => Math.floor(Math.random() * 5) + 1
		);
		const spark2 = Array.from(
			{ length: 36 },
			() => Math.floor(Math.random() * 5) + 1
		);

		const refreshSpark = () => {
			spark1.shift();
			spark1.push(Math.floor(Math.random() * 5) + 1);
			spark2.shift();
			spark2.push(Math.floor(Math.random() * 5) + 1);
			this.sparkline.setData(["Server1", "Server2"], [spark1, spark2]);
		};

		refreshSpark();
		setInterval(refreshSpark, 1000);
	}

	// private updateLCD(): void {
	// 	const colors = ["green", "magenta", "cyan", "red", "blue"];
	// 	const text = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

	// 	setInterval(() => {
	// 		const value = Math.floor(Math.random() * 100);
	// 		this.lcdLineOne.setDisplay(`${value}${text[value % 12]}`);
	// 		this.lcdLineOne.setOptions({
	// 			color: colors[value % 5],
	// 			elementPadding: 4,
	// 		});
	// 		this.screen.render();
	// 	}, 1500);
	// }

	private updateDonut(): void {
		let pct = 0.0;

		const update = () => {
			if (pct > 0.99) pct = 0.0;
			const color =
				pct >= 0.75
					? "red"
					: pct >= 0.5
						? "yellow"
						: pct >= 0.25
							? "cyan"
							: "green";
			this.donut.setData([
				{
					percent: Number.parseFloat((pct + 0.0) % 1).toFixed(2),
					label: "storage",
					color,
				},
			]);
			pct += 0.01;
		};

		setInterval(() => {
			update();
			this.screen.render();
		}, 500);
	}
}
