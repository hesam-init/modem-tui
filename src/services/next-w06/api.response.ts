type SoftwareVersion = `${number}.${number}.${number}(${string})`;

export type NextW06ApiResponse = {
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
};
