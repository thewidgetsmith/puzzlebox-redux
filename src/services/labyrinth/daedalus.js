/**
 * Daedalus - The Labrynth builder
 */

/**
 * @typedef {Object} LabyrinthOptions
 * @property {number} logo_depth              - logo (and inside text) cut depth in millimeters
 * @property {bool}   logo_in_lid             - include A&A logo in last lid
 * @property {number} maze_complexity         - maze complexity range (-10 to 10) lower is less complex
 * @property {bool}   maze_flip               - alternating inside/outside maze
 * @property {bool}   maze_is_inside          - maze on inside (increases difficulty)
 * @property {number} maze_helix              - degree of helical spiral applied to maze (0 for non-helical)
 * @property {number} maze_margin             - maze top margin in millimeters
 * @property {bool}   maze_mirror_inside      - clockwise lock on inside
 * @property {number} maze_spacing            - maze spacing in millimeters
 * @property {number} maze_thickness          - maze thickness in millimeters
 * @property {number} nub_count               - number of maze following nubs
 * @property {number} nub_r_clearance         - extra clearance on radius for nub in millimeters
 * @property {number} nub_z_clearance         - extra clearance on height of nub in millimeters
 * @property {number} outer_faces             - number of faces on outermost part (0=round, 1,2=broken, 3+ works)
 * @property {number} outer_round             - rounding on outermost part ends in millimeters
 * @property {number} part_base_gap           - base gap (z clearance) in millimeters
 * @property {number} part_base_height        - base height in millimeters
 * @property {number} part_base_thickness     - base thickness in millimeters
 * @property {bool}   part_base_is_full_width - inside base is full width
 * @property {number} part_clearance          - general x/y clearance in millimeters
 * @property {number} part_core_diameter      - core diameter for content in millimeters
 * @property {number} part_core_gap           - core gap to allow content to be removed in millimeters
 * @property {number} part_core_height        - core height for content in millimeters
 * @property {bool}   part_core_is_solid      - core part is solid
 * @property {number} part_count              - total number of puzzle box parts
 * @property {number} part_grip_depth         - grip depth in millimeters
 * @property {number} part_select             - part selected to be built (0 for all)
 * @property {number} part_thickness          - part wall thickness in millimeters
 * @property {number} park_thickness          - thickness of park ridge to click closed in millimeters
 * @property {bool}   park_vertical           - park vertically (indicates a vertical park versus a horizontal park)
 * @property {bool}   symmetric_cut           - symmetric maze cut
 * @property {number} text_depth              - text cut depth in millimeters
 * @property {string} text_end                - text (initials) on end
 * @property {string} text_font               - text font name
 * @property {string} text_font_end           - text font name for `text_end`
 * @property {string} text_inside             - text (initials) inside end
 * @property {bool}   text_outset             - text on sides is outset vs embossed
 * @property {string} text_side               - text on side
 * @property {number} text_side_scale         - scale side text (i.e. if too long)
 * @property {bool}   text_slow               - text has diagonal edges (very slow)
 * @property {bool}   zzz_no_a                - no "A" included at the final park point
 * @property {bool}   zzz_test                - test pattern instead of maze
 */

/**
 * @typedef {Object} LabyrinthModel
 * @property {string} content - the generated SCAD file content
 * @property {string} mime    - the SCAD file mime type
 * @property {string} name    - the SCAD file name
 */

const OPTION_METADATA = {
  logo_depth: { short: 'L', long: 'Logo cut depth (mm)' },
  logo_in_lid: { short: 'A', long: 'Include logo in last lid' },
  maze_complexity: { short: 'X', long: 'Maze complexity (-10 to 10)' },
  maze_flip: { short: 'f', long: 'Alternating inside/outside maze' },
  maze_is_inside: { short: 'i', long: 'Maze on inside' },
  maze_helix: { short: 'H', long: 'Degree of helical spiral applied to maze' },
  maze_margin: { short: 'M', long: 'Maze top margin (mm)' },
  maze_spacing: { short: 'z', long: 'Maze spacing (mm)' },
  maze_thickness: { short: 't', long: 'Maze thickness' },
  nub_count: { short: 'N', long: 'Number of maze following nubs' },
  nub_r_clearance: { short: 'y', long: 'Extra clearance on radius for nub' },
  nub_z_clearance: { short: 'Z', long: 'Extra clearance on height of nub' },
  outer_faces: { short: 's', long: 'Number of faces on outermost part (0=round)' },
  outer_round: { short: 'r', long: 'Rounding on outermost part ends (mm)' },
  part_base_gap: { short: 'G', long: 'Base gap (Z clearance)' },
  part_base_height: { short: 'b', long: 'Base height (mm)' },
  part_base_thickness: { short: 'B', long: 'Base thickness (mm)' },
  part_base_is_full_width: { short: 'W', long: 'Inside base is full width' },
  part_clearance: { short: 'g', long: 'General X/Y clearance (mm)' },
  part_core_diameter: { short: 'c', long: 'Core diameter for content (mm)' },
  part_core_gap: { short: 'C', long: 'Core gap (mm)' },
  part_core_height: { short: 'h', long: 'Core height for content (mm)' },
  part_core_is_solid: { short: 'q', long: 'Core is solid' },
  part_count: { short: 'm', long: 'Total parts' },
  part_grip_depth: { short: 'R', long: 'Grip depth (mm)' },
  part_select: { short: 'n', long: 'Part to make (0 for all)' },
  part_thickness: { short: 'w', long: 'Wall thickness' },
  park_thickness: { short: 'p', long: 'Thickness of park ridge to click closed' },
  park_vertical: { short: 'v', long: 'Park vertically' },
  symmetric_cut: { short: 'V', long: 'Symmetric maze cut' },
  text_depth: { short: 'D', long: 'Text depth (mm)' },
  text_end: { short: 'E', long: 'Text on end' },
  text_font: { short: 'F', long: 'Text font' },
  text_font_end: { short: 'e', long: 'Text font end' },
  text_inside: { short: 'I', long: 'Text inside end' },
  text_outset: { short: 'O', long: 'Text outset' },
  text_side: { short: 'S', long: 'Text on side' },
  text_side_scale: { short: 'T', long: 'Scale side text' },
  text_slow: { short: 'Z', long: 'Diagonal text edges' },
  zzz_no_a: { short: null, long: 'No "A"' },
  zzz_test: { short: 'Q', long: 'Test pattern' }
}

const OPTION_DEFAULTS = {
  logo_depth: 0.6,
  logo_in_lid: false,
  maze_complexity: 5,
  maze_flip: false,
  maze_is_inside: false,
  maze_mirror_inside: false, // Clockwise lock on inside - may be unwise as more likely to come undone with outer.
  maze_helix: 3,
  maze_margin: 1,
  maze_spacing: 3,
  maze_thickness: 2,
  nub_count: 3,
  nub_r_clearance: 0.1,
  nub_z_clearance: 0.2,
  outer_faces: 7,
  outer_round: 2,
  part_base_gap: 0.4,
  part_base_height: 10,
  part_base_thickness: 1.6,
  part_base_is_full_width: false,
  part_clearance: 0.4,
  part_core_diameter: 10,
  part_core_gap: 0,
  part_core_height: 50,
  part_core_is_solid: false,
  part_count: 4,
  part_grip_depth: 2,
  part_select: 0,
  part_thickness: 1.2,
  park_thickness: 0.7,
  park_vertical: false,
  symmetric_cut: false,
  text_depth: 0.5,
  text_end: null,
  text_font: null,
  text_font_end: null,
  text_inside: null,
  text_outset: false,
  text_side: null,
  text_side_scale: 1,
  text_slow: false,
  zzz_no_a: false,
  zzz_test: false
}

const FILE_MIME_TYPE = 'application/scad'

const FLAG_DIR_L = 0x01 // Left
const FLAG_DIR_R = 0x02 // Right
const FLAG_DIR_U = 0x04 // Up
const FLAG_DIR_D = 0x08 // Down
const FLAG_DIR_A = 0x0F // All
const FLAG_DIR_I = 0x80 // Invalid

// direction bias for random maze choices
const BIAS_L = 2 // Left
const BIAS_R = 1 // Right
const BIAS_U = 1 // Up
const BIAS_D = 4 // Down

// scales used for some aspects of output
const SCALE = 1000
const SCALE_I = 0.001

const mergeOptions = (options) => {
  const merged = { ...OPTION_DEFAULTS, ...options }

  // add logo depth to part base thickness
  merged.part_base_thickness = merged.part_base_thickness + merged.logo_depth

  return merged
}

const validateOptions = (options) => {
  return []
}

/**
 *
 * @param {*} x
 */
const calculateScale = (x) => Math.round((x) * SCALE)

/**
 *
 */
const normalize = () => {
  // if
}

/**
 * Builds SCAD file mime type
 * @returns {string} the SCAD file mime type
 */
const buildMimeType = () => {
  // NOTE: any chance of exporting as additional file types?
  return FILE_MIME_TYPE
}

/**
 * Builds SCAD download file name
 * @param {LabyrinthOptions} options
 * @returns {string} the downloaded file name
 */
const buildFileName = (options) => {
  // TODO: incorporate some options into file name
  return 'puzzlebox.scad'
}

/**
 * Builds SCAD file header text block
 * @param {LabyrinthOptions} options
 * @param {date} createdAt - date at which the model was created
 * @returns {string} SCAD file header text block
 */
const buildFileHeader = (options, createdAt = new Date()) => {
  const header = []
  header.push('// Puzzlebox by RevK, @TheRealRevK www.me.uk')
  header.push('// Puzzlebox Redux by The Widgetsmith, https://www.thewidgetsmith.com')
  header.push('// Thingiverse examples and instructions https://www.thingiverse.com/thing:2410748')
  header.push('// Original GitHub source https://github.com/revk/PuzzleBox')
  header.push('// Redux GitHub source https://github.com/thewidgetsmith/puzzlebox')
  header.push('// Puzzle Box generated using Puzzlebox Redux at https://www.thewidgetsmith.com/puzzlebox')
  header.push(`// Created ${createdAt.toISOString()}`)

  for (const [key, value] of Object.entries(options)) {
    if (value && OPTION_METADATA[key] !== undefined && OPTION_METADATA[key].short) {
      header.push(`// ${OPTION_METADATA[key].long}: ${OPTION_METADATA[key].short}=${value}`)
    }
  }

  return header.join('\n').concat('\n')
}

/**
 * Builds SCAD modules configuration
 * @param {LabyrinthOptions} options
 * @returns {string} SCAD modules configuration
 */
const buildModules = (options) => {
  const scaled = calculateScale(options.text_depth)

  const modules = []
  if (options.text_slow) {
    modules.push(`\
      module cuttext(){translate([0,0,-${SCALE}])\
      minkowski(){rotate([0,0,22.5])cylinder(h=${scaled},d1=${scaled},d2=0,$fn=8);\
      linear_extrude(height=${SCALE},convexity=10)mirror([1,0,0])children();}}`)
  } else {
    modules.push(
      `module cuttext(){linear_extrude(height=${scaled},convexity=10,center=true)mirror([1,0,0])children();}`)
  }

  // TODO: perhaps replace this with the logo for this app
  // You can use the A&A logo on your maze print providing it is
  // tasteful and not in any way derogatory to A&A or any staff/officers.
  if (options.logo_in_lid) {
    // eslint-disable-next-line no-multi-str
    modules.push('\
      module aa(w=100,white=0,$fn=100){scale(w/100){if(!white)\
      difference(){circle(d=100.5);circle(d=99.5);}difference(){if(white)circle(d=100);\
      difference(){circle(d=92);for(m=[0,1])mirror([m,0,0]){difference(){translate([24,0,0])circle(r=22.5);\
      translate([24,0,0])circle(r=15);}polygon([[1.5,22],[9,22],[9,-18.5],[1.5,-22]]);}}}}} \
      // A&A Logo is copyright (c) 2013 and trademark Andrews & Arnold Ltd')
  }

  const faceScale = options.outer_faces || 100
  const rounding = calculateScale(options.outer_round)
  modules.push(
    `module outer(h,r){e=${rounding};minkowski(){cylinder(r1=0,r2=e,h=e,$fn=24);cylinder(h=h-e,r=r,$fn=${faceScale});}}`)

  return modules.join('\n').concat('\n')
}

/**
 * Builds puzzle box parts or selected part if a single part is selected
 * @param {LabyrinthOptions} options
 * @returns {string} generated SCAD puzzle boxes
 */
const buildParts = (options) => {

  let x = 0
  let y = 0
  let sq = Math.sqrt(options.part_count) + 0.5
  let n = sq * sq - options.part_count

  const parts = [`scale(${SCALE_I}){`]
  if (options.part_select === 0) {
    for (let i = 1; i <= options.part_count; i++) {
      parts.push(buildPart(i, options))

      // x += (options.outer_faces & 1 ? r3 : r2) + r2 + 5
      if (++n >= sq) {
        // y += (options.outer_faces & 1 ? r3 : r2) * 2 + 5
        x = 0
        n = 0
      }
    }
  } else {
    parts.push(buildPart(options.part_select, options))
  }
  parts.push('}')

  return parts.join('\n').concat('\n')
}

/**
 * Builds a single part of the Puzzle Box model
 * @param {number} part - the part number
 * @param {LabyrinthOptions} options
 * @returns {string} generated SCAD box
 */
const buildPart = (partNum, options) => {
  let N, X, Y, Z, S
  let entrya = 0 // Entry angle


  // temp
  let x = 0
  let y = 0


  const placement = getMazePlacement(partNum, options)
  const dimensions = getPartDimensions(partNum, placement, options)

  const part = [`// Part ${partNum} (${Number(dimensions.r0).toFixed(2)}mm to ${Number(dimensions.r1).toFixed(2)}mm and ${Number(dimensions.r2).toFixed(2)}mm/${Number(dimensions.r3).toFixed(2)}mm base)`]

  const scaleX = calculateScale(x + (options.outer_faces % 2 === 1 ? dimensions.r3 : dimensions.r2))
  const scaleY = calculateScale(y + (options.outer_faces % 2 === 1 ? dimensions.r3 : dimensions.r2))
  part.push(`translate([${scaleX},${scaleY},0])`)

  if (options.outer_faces) {
    part.push(`rotate([0,0,${180 / options.outer_faces + (partNum + 1 === options.part_count ? 180 : 0)}])`)
  }

  part.push('{')

  // MAZE

  part.push('difference(){union(){')

  if (placement.mazeInside) {
    part.push(buildMaze(dimensions.r0, true, options))
  }

  if (placement.mazeOutside) {
    part.push(buildMaze(dimensions.r1, false, options))
  }

  if (!(placement.mazeInside) && !(placement.mazeOutside) && partNum < options.part_count) {
    part.push('difference(){')
    // Non maze
    const cylinderFn = dimensions.W * 4
    const cylinderH = calculateScale(dimensions.height - options.base_thickness / 2 + options.part_clearance)
    const cylinderR = calculateScale(dimensions.r1)
    const translateZ = calculateScale(options.base_thickness / 2 - options.part_clearance)
    part.push(`translate([0,0,${translateZ}])cylinder(r=${cylinderR},h=${cylinderH},$fn=${cylinderFn});\
      translate([0,0,${calculateScale(options.base_thickness)}])cylinder(r=${calculateScale(dimensions.r0)},h=${calculateScale(dimensions.height)},$fn=${cylinderFn});`)
    part.push('}')
  }

  // BASE

  part.push('difference(){')

  if (partNum === options.part_count) {
    part.push(`outer(${calculateScale(dimensions.height)},${calculateScale((dimensions.r2 - options.outer_round) / Math.cos(Math.PI / (options.outer_faces || 100)))});`)
  } else if (partNum + 1 >= options.part_count) {
    part.push(`mirror([1,0,0])outer(${calculateScale(options.part_base_height)},${calculateScale((dimensions.r2 - options.outer_round) / Math.cos(Math.PI / (options.outer_faces || 100)))});`)
  } else {
    part.push(`hull(){cylinder(r=${calculateScale(dimensions.r2 - options.maze_thickness)},h=${calculateScale(options.part_base_height)},$fn=${dimensions.W * 4});translate([0,0,${calculateScale(options.maze_margin)}])cylinder(r=${calculateScale(dimensions.r2)},h=${calculateScale(options.part_base_height - options.maze_margin)},$fn=${dimensions.W * 4});}`)
  }

  console.log('OPTIONS', options)
  console.log('SCALED', `${calculateScale(options.part_base_thickness)}`)

  // Hole
  part.push(`translate([0,0,${calculateScale(options.part_base_thickness)}])cylinder(r=${calculateScale(dimensions.r0 + (partNum > 1 && placement.mazeInside ? options.maze_thickness + options.part_clearance : 0) + (!(placement.mazeInside) && partNum < options.part_count ? options.part_clearance : 0))},h=${calculateScale(dimensions.height)},$fn=${dimensions.W * 4});`)
  part.push('}')
  part.push('}')

  // CUT OUTS

  // TEXT SIDE

  part.push('}')

  // ADD NUBS

  part.push('}')

  // x += (options.outer_faces & 1 ? dimensions.r3 : dimensions.r2) + dimensions.r2 + 5
  // if (++n >= sq) {
  //   y += (options.outer_faces & 1 ? dimensions.r3 : dimensions.r2) * 2 + 5
  //   n = 0
  //   x = 0
  // }

  return part.join('\n').concat('\n')
}

/**
 *
 * @param {*} partNum
 * @param {*} param1
 * @returns {{ * }}
 */
const getMazePlacement = (partNum, { maze_flip, maze_is_inside, part_count }) => {
  let mazeInside = maze_is_inside   // This part has maze inside
  let mazeOutside = !maze_is_inside // This part has maze outside
  let nextInside = maze_is_inside   // Next part has maze inside
  let nextOutside = !maze_is_inside // Next part has maze outside

  if (maze_flip) {
    if (partNum % 2 === 0) {
      mazeOutside = 1 - mazeOutside
      nextInside = 1 - nextInside
    } else {
      mazeInside = 1 - mazeInside
      nextOutside = 1 - nextOutside
    }
  }

  if (partNum === 1) {
    mazeInside = false
  }

  if (partNum === part_count) {
    mazeOutside = false
  }

  if (partNum + 1 >= part_count) {
    nextOutside = false
  }

  if (partNum === part_count) {
    nextInside = false
  }

  return {
    mazeInside,
    mazeOutside,
    nextInside,
    nextOutside
  }
}

/**
 *
 * @param {*} partNum
 * @param {*} mazeParams
 * @param {*} options
 * @returns
 */
const getPartDimensions = (partNum, {
  mazeInside,
  mazeOutside,
  nextInside,
  nextOutside
}, {
  maze_is_inside,
  maze_spacing,
  maze_thickness,
  nub_count,
  outer_faces,
  part_base_gap,
  part_base_height,
  part_base_is_full_width,
  part_base_thickness,
  part_clearance,
  part_core_diameter,
  part_core_gap,
  part_core_height,
  part_core_is_solid,
  part_count,
  part_thickness,
  text_depth,
  text_outset,
  text_side
}) => {
  // Dimensions
  // r0 is inside of part+maze
  // r1 is outside of part+maze
  // r2 is outside of base before "sides" adjust
  // r3 is outside of base with "sides" adjust

  // Outer
  let r1 = part_core_diameter / 2 + part_thickness + (partNum - 1) * (part_thickness + maze_thickness + part_clearance)

  if (part_core_is_solid) {
    // Adjust to make part 2 the core diameter
    r1 -= part_thickness + maze_thickness + part_clearance - (maze_is_inside ? maze_thickness : 0)
  }

  // Default value
  const W = (parseInt(r1 * 2 * Math.PI / maze_spacing)) / nub_count * nub_count
  let r0 = r1 - part_thickness // Inner

  if (mazeInside && partNum > 1) {
    r0 -= maze_thickness // Maze on inside
  }

  if (mazeOutside && partNum < part_count) {
    r1 += maze_thickness // Maze on outside
  }

  let r2 = r1 // Base outer

  if (partNum < part_count) {
    r2 += part_clearance
  }

  if (partNum + 1 >= part_count && text_side && !text_outset) {
    r2 += text_depth
  }

  if (nextInside) {
    r2 += maze_thickness
  }

  if (nextOutside || partNum + 1 === part_count) {
    r2 += part_thickness
  }

  if (part_base_is_full_width && partNum + 1 < part_count) {
    r2 += nextOutside ? maze_thickness : part_thickness
  }

  let r3 = r2

  if (outer_faces && partNum + 1 >= part_count) {
    // Bigger because of number of sides
    r3 /= Math.cos((Math.PI).toFixed(6) / outer_faces)
  }

  let height = (part_core_is_solid ? part_core_gap + part_base_height : 0)
    + part_core_height + part_base_thickness + (part_base_thickness + part_base_gap) * (partNum - 1)

  if (partNum === 1) {
    height -= (part_core_is_solid ? part_core_height : part_core_gap)
  }

  if (partNum > 1) {
    // base from previous unit is added to this
    height -= part_base_height
  }

  return {
    height,
    r0,
    r1,
    r2,
    r3,
    W
  }
}

const buildMaze = (dimension, isInside, options) => {
}

const addNub = (dimension, isInside, options) => {
}

/**
 * Builds a puzzlebox maze and parts as SCAD models.
 *
 * @param {LabyrinthOptions} options
 * @returns {LabyrinthModel} generated puzzle box SCAD model
 */
function build (options) {
  const opts = mergeOptions(options)
  const errors = validateOptions(opts)
  if (errors.length > 0) {
    // throw exception or return errors
  }

  const mimeType = buildMimeType()
  const fileName = buildFileName(opts)

  let buff = buildFileHeader(opts)
  buff = buff.concat(buildModules(opts))
  buff = buff.concat(buildParts(opts))

  return {
    content: buff,
    mime: mimeType,
    name: fileName
  }
}

exports.build = build
