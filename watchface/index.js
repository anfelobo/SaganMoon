// ============================================================
// SAGAN MOON
// Watchface para Amazfit Bip Max
// Resolución: 432 x 514 px
//
// Primera prueba de renderizado:
//   - Fondo rojo
//   - Texto SAGANMOON
//
// Esta versión utiliza la API 2.0 de Zepp OS.
// ============================================================


// ============================================================
// 1. CONFIGURACIÓN GENERAL
// ============================================================
//
// Resolución de pantalla del Amazfit Bip Max.
// ============================================================

const SCREEN_WIDTH = 432
const SCREEN_HEIGHT = 514


// ============================================================
// 2. VARIABLES
// ============================================================
//
// En esta prueba no necesitamos variables adicionales.
// ============================================================


// ============================================================
// 3. INICIALIZACIÓN
// ============================================================
//
// Importamos la interfaz gráfica de Zepp OS mediante @zos/ui.
// En API 2.0 hmUI NO es una variable global.
// ============================================================

import * as hmUI from '@zos/ui'


// ============================================================
// 4. WATCHFACE
// ============================================================
//
// Page() es la estructura utilizada por la API 2.0 para
// construir la interfaz del watchface.
// ============================================================

Page({

  // ----------------------------------------------------------
  // 4.1 INICIALIZACIÓN
  // ----------------------------------------------------------
  //
  // Se ejecuta cuando el watchface comienza.
  // ----------------------------------------------------------

  onInit() {

    console.log('SaganMoon: iniciando watchface')

  },


  // ----------------------------------------------------------
  // 4.2 CONSTRUCCIÓN DE LA INTERFAZ
  // ----------------------------------------------------------
  //
  // En esta primera prueba solamente dibujamos un rectángulo
  // rojo y un texto.
  // ----------------------------------------------------------

  build() {

    console.log('SaganMoon: construyendo interfaz')


    // ========================================================
    // 4.2.1 FONDO
    // ========================================================
    //
    // Creamos un rectángulo rojo que ocupa toda la pantalla.
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x: 0,
        y: 0,
        w: SCREEN_WIDTH,
        h: SCREEN_HEIGHT,
        color: 0xFF0000
      }
    )


    // ========================================================
    // 4.2.2 TEXTO DE PRUEBA
    // ========================================================
    //
    // Si todo funciona correctamente veremos SAGANMOON
    // en el centro de la pantalla.
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        x: 0,
        y: 200,
        w: SCREEN_WIDTH,
        h: 80,
        text: 'SAGANMOON',
        text_size: 40,
        color: 0xFFFFFF,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V
      }
    )

  },


  // ==========================================================
  // 5. DESTRUCCIÓN
  // ==========================================================
  //
  // Se ejecuta cuando el watchface deja de estar activo.
  // ==========================================================

  onDestroy() {

    console.log('SaganMoon: cerrando watchface')

  }

})