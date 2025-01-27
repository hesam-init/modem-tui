type SoftwareVersion = `${number}.${number}.${number}(${string})`;

export type NextW06ApiResponse = {
	TempToken: {
		token: string;
	};
	Status: {
		ConnectionStatus: string;
		WifiConnectionStatus: string;
		SignalStrength: string;
		SignalIcon: string;
		CurrentNetworkType: string;
		CurrentServiceDomain: string;
		RoamingStatus: string;
		BatteryStatus: string;
		BatteryLevel: string;
		BatteryPercent: string;
		simlockStatus: string;
		PrimaryDns: string;
		SecondaryDns: string;
		PrimaryIPv6Dns: string;
		SecondaryIPv6Dns: string;
		CurrentWifiUser: string;
		TotalWifiUser: string;
		currenttotalwifiuser: string;
		ServiceStatus: string;
		SimStatus: string;
		WifiStatus: string;
		CurrentNetworkTypeEx: string;
		WanPolicy: string;
		maxsignal: string;
		wifiindooronly: string;
		wififrequence: string;
		classify: string;
		flymode: string;
		cellroam: string;
		dfsstatus: string;
		channelselection: string;
		batterydisplay: string;
		currentnetworkstring: string;
		usbup: string;
		wifiswitchstatus: string;
		bluetooth_edr_switch: string;
		bluetooth_edr_currert_user: string;
		hvdcp_online: string;
	};
	BasicInformation: {
		productfamily: string;
		classify: string;
		multimode: number;
		restore_default_status: number;
		sim_save_pin_enable: number;
		devicename: string;
		softwareversion: SoftwareVersion;
		SoftwareVersion: SoftwareVersion;
		WebUIVersion: SoftwareVersion;
		spreadname_en: string;
		spreadname_zh: string;
	};
	UsbTethering: {
		tetheringswitch: number;
	};
};
