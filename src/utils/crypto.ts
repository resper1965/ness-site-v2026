/**
 * Zero-Trust WebCrypto API
 * Utiliza RSA-OAEP para encriptar payloads no Frontend ANTES de enviar para a nuvem.
 * A Cloudflare armazena o hash/buffer cego. Apenas o DPO offline (com a Private Key correspondente) consegue ler.
 *
 * NOTA: Esta lib usa a API nativa do browser (window.crypto.subtle), não pesa no bundle e não custa serviços de KMS pagos.
 */

// Chave Pública do DPO Padrão (Exemplo/Mock - Substituir pela chave de Prod)
export const DPO_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuT3Z...
-----END PUBLIC KEY-----`;

function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2base64(buf: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Importa a chave PEM pública em um objeto CryptoKey de criptografia assimétrica.
 */
async function importPublicKey(pem: string): Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  let pemContents = pem.substring(pem.indexOf(pemHeader) + pemHeader.length, pem.indexOf(pemFooter));
  pemContents = pemContents.replace(/\s/g, '');
  
  const binaryDerString = window.atob(pemContents);
  const binaryDer = str2ab(binaryDerString);

  return await window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

/**
 * Encripta um objeto limpo (JSON payload) usando Zero-Trust Asymmetric pattern.
 * Retorna uma string base64 blindada, ou lança falha localmente.
 */
export async function encryptZeroTrustPayload(data: Record<string, any>, publicKeyPem: string = DPO_PUBLIC_KEY_PEM): Promise<string> {
  try {
    const key = await importPublicKey(publicKeyPem);
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));
    
    const encryptedDataBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      encodedData
    );
    
    return ab2base64(encryptedDataBuffer);
  } catch (error) {
    console.error("Falha na criptografia WebCrypto Zero-Trust:", error);
    throw new Error("Ocorreu um erro ao proteger localmente sua manifestação. Contate TI.");
  }
}
