import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CleanProduct } from "./types/dbtypes";
import { UUID } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilidad para normalizar texto
function normalize(str: string) {
  return str
    .normalize("NFD")                       // elimina tildes
    .replace(/[\u0300-\u036f]/g, "")        // elimina restos unicode
    .replace(/[^a-zA-Z0-9]/g, "")           // solo letras/números
    .toUpperCase();
}

// Convierte un atributo a su código (máx 3 letras)
function attrCode(value: string) {
  const clean = normalize(value);

  // Casos especiales comunes (talles, etc.)
  const special = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  if (special.includes(clean)) return clean;

  return clean.substring(0, 3);
}

/**
 * Genera un SKU profesional
 * @param productName Nombre del producto
 * @param attributesSelected Lista de atributos con valores seleccionados
 * @param suffix Número opcional para evitar duplicados
 */
export function generateSku(
  productName: string,
  attributesSelected: { selectedValue: {value:string} }[],
  suffix?: number
) {
  // 1. Código base del producto (3 letras)
  const productCode = normalize(productName).substring(0, 3);
  console.log("ATRIBUTOS SELECCIONADOS", attributesSelected)
  // 2. Convertimos atributos → códigos
  const attributeCodes = attributesSelected
    .flatMap((att) => attrCode(att.selectedValue.value))
    .slice(0, 4); // Máximo 4 atributos para no hacer un SKU interminable

  // 3. Unimos todo
  let sku = [productCode, ...attributeCodes].join("-");
  console.log("SKU CREADO", sku)
  // 4. Sufijo único opcional
  if (suffix !== undefined) {
    sku += "-" + String(suffix).padStart(2, "0");
  }

  return sku;
}
