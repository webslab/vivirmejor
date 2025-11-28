import { Parser } from "@json2csv/plainjs";

export type ExportFormat = "json" | "csv";

interface Question {
	reference?: string;
	[key: string]: unknown;
}

interface Answer {
	content: string;
	question?: Question;
}

interface Action {
	name: string;
	time: string;
	current?: number;
}

interface PaperData {
	[key: string]: unknown;
	module?: { id: string; title: string };
	answers?: Answer[];
	user?: { id: string; name: string; username: string };
	actions?: Action[];
}

interface FlattenedRow {
	[key: string]: string | null | unknown;
	module_id: string | null;
	module_title: string | null;
	user_id: string | null;
	user_name: string | null;
	user_username: string | null;
	performance_time: string | null;
}

/**
 * Transforma datos de papers a formato pivotado (una fila por paper)
 * Cada reference de pregunta se convierte en una columna
 * Las respuestas se distribuyen en las columnas correspondientes según su reference
 */
function flattenToRows(data: PaperData[]): FlattenedRow[] {
	const rows: FlattenedRow[] = [];

	for (const paper of data) {
		const { module, answers, user, actions, ...paperFields } = paper;

		// Calcular tiempo total de desempeño
		let performanceTime: string | null = null;
		if (actions && actions.length > 0) {
			const startAction = actions.find((action) => action.name === "start");
			const submitAction = actions.find((action) => action.name === "submit");

			if (startAction && submitAction) {
				const startTime = new Date(startAction.time);
				const submitTime = new Date(submitAction.time);
				const diffMs = submitTime.getTime() - startTime.getTime();

				// Formatear como HH:MM:SS
				const hours = Math.floor(diffMs / (1000 * 60 * 60));
				const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

				performanceTime = `${hours.toString().padStart(2, "0")}:${
					minutes.toString().padStart(2, "0")
				}:${seconds.toString().padStart(2, "0")}`;
			}
		}

		// Crear objeto base con datos del paper
		const row: FlattenedRow = {
			...paperFields,
			module_id: module?.id || null,
			module_title: module?.title || null,
			user_id: user?.id || null,
			user_name: user?.name || null,
			user_username: user?.username || null,
			performance_time: performanceTime,
		};

		// Mapear cada respuesta a su columna según reference
		// Contador para manejar referencias duplicadas
		const referenceCounts: { [key: string]: number } = {};

		if (answers && answers.length > 0) {
			for (const answer of answers) {
				const reference = answer.question?.reference;
				if (reference) {
					// Verificar si ya existe esta referencia
					if (row[reference] !== undefined) {
						// Ya existe, incrementar el contador
						referenceCounts[reference] = (referenceCounts[reference] || 1) + 1;
						// Usar reference con sufijo numérico
						const suffixedReference = `${reference}_${referenceCounts[reference]}`;
						row[suffixedReference] = answer.content || null;
					} else {
						// Primera ocurrencia, usar el reference tal cual
						row[reference] = answer.content || null;
					}
				}
			}
		}

		rows.push(row);
	}

	return rows;
}

/**
 * Transforma datos de papers a formato compacto (una fila por paper)
 * Opción A: Arrays como JSON strings
 */
function flattenToSingleRow(data: PaperData[]): FlattenedRow[] {
	return data.map((paper) => {
		const { module, answers, user, actions, ...paperFields } = paper;

		// Calcular tiempo total de desempeño
		let performanceTime: string | null = null;
		if (actions && actions.length > 0) {
			const startAction = actions.find((action) => action.name === "start");
			const submitAction = actions.find((action) => action.name === "submit");

			if (startAction && submitAction) {
				const startTime = new Date(startAction.time);
				const submitTime = new Date(submitAction.time);
				const diffMs = submitTime.getTime() - startTime.getTime();

				// Formatear como HH:MM:SS
				const hours = Math.floor(diffMs / (1000 * 60 * 60));
				const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

				performanceTime = `${hours.toString().padStart(2, "0")}:${
					minutes.toString().padStart(2, "0")
				}:${seconds.toString().padStart(2, "0")}`;
			}
		}

		return {
			...paperFields,
			module_id: module?.id || null,
			module_title: module?.title || null,
			user_id: user?.id || null,
			user_name: user?.name || null,
			user_username: user?.username || null,
			answers: answers ? JSON.stringify(answers) : null,
			performance_time: performanceTime,
		};
	});
}

/**
 * Exporta datos a JSON
 */
export function exportToJSON(data: FlattenedRow[]): Blob {
	const jsonData = JSON.stringify(data, null, 2);
	return new Blob([jsonData], { type: "application/json" });
}

/**
 * Exporta datos a CSV
 * @param data - Datos originales de la base de datos
 * @param usePivotedFormat - true para formato pivotado (references como columnas), false para formato compacto (answers como JSON)
 */
export function exportToCSV(data: PaperData[], usePivotedFormat: boolean = true): Blob {
	// Transformar datos según la opción elegida
	const transformedData = usePivotedFormat ? flattenToRows(data) : flattenToSingleRow(data);

	// Configurar el parser de json2csv
	const parser = new Parser({
		delimiter: ",",
		eol: "\n",
	});

	const csv = parser.parse(transformedData);
	return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}

/**
 * Descarga un archivo en el navegador
 */
export function downloadFile(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

/**
 * Genera nombre de archivo con timestamp
 */
export function generateFilename(prefix: string, extension: ExportFormat): string {
	const date = new Date().toISOString().split("T")[0];
	return `${prefix}-${date}.${extension}`;
}

/**
 * Función principal de exportación
 */
export function exportData(
	data: unknown,
	format: ExportFormat,
	filePrefix: string = "export",
	usePivotedCSV: boolean = true,
): void {
	// SurrealDB devuelve un array donde result[0] contiene los datos reales
	// Extraer los datos del primer elemento si es necesario
	const actualData: PaperData[] =
		(Array.isArray(data) && data.length > 0 && Array.isArray(data[0])
			? data[0]
			: data) as PaperData[];

	let blob: Blob;

	if (format === "json") {
		blob = exportToJSON(flattenToRows(actualData));
	} else {
		blob = exportToCSV(actualData, usePivotedCSV);
	}

	const filename = generateFilename(filePrefix, format);
	downloadFile(blob, filename);
}
