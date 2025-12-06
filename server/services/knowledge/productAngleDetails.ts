import { MockupAngle, CameraSpec } from '@shared/mockupTypes';

export const CAMERA_SPECS: Record<MockupAngle, CameraSpec> = {
  'front': {
    angle: 'front',
    lensType: 'Standard/Portrait',
    focalLength: '50-85mm',
    aperture: 'f/5.6-f/8',
    sensorDistance: '6-8 feet',
    fieldOfView: 'Normal (45-50°)',
    depthOfField: 'Deep - subject fully in focus',
    perspective: 'Natural, minimal distortion',
    technicalDescription: 'Eye-level frontal shot using 50-85mm lens at f/5.6-f/8, positioned 6-8 feet from subject, creating natural perspective with minimal distortion',
    promptAddition: `**CAMERA/ANGLE: Front View.** The camera is positioned directly in front of the subject for a symmetrical, straight-on view. The model is facing the camera. The framing is a classic Medium Shot, cropped from just above the head to just below the waist. This is a standard commercial product shot with natural proportions and no perspective distortion. Lens: 85mm at f/5.6.`,
    bestFor: ['E-commerce listings', 'Product catalogs', 'Size reference', 'Clean product shots'],
    commonMistakes: [
      'Using wide-angle lens causing barrel distortion',
      'Camera too close causing exaggerated perspective',
      'Off-center positioning creating asymmetry',
      'Shallow depth of field blurring important details'
    ]
  },

  'three-quarter': {
    angle: 'three-quarter',
    lensType: 'Portrait',
    focalLength: '85-105mm',
    aperture: 'f/4-f/5.6',
    sensorDistance: '8-10 feet',
    fieldOfView: 'Narrow (30-40°)',
    depthOfField: 'Moderate - subject sharp, background soft',
    perspective: 'Slight compression, flattering',
    technicalDescription: 'Three-quarter angle using 85-105mm lens at f/4-f/5.6, positioned 8-10 feet from subject at 30-45° angle, creating dimensional depth',
    promptAddition: `**CAMERA/ANGLE: Three-Quarter View.** The model is posed at a 30-45 degree angle to the camera, showing both the front and side of the garment to create depth and dimension. The framing is a Medium Shot, cropped from just above the head to just below the waist. This angle must clearly show how the garment fits the torso in 3D. Lens: 105mm at f/4.`,
    bestFor: ['Fashion photography', 'Lifestyle shots', 'Showing fit and drape', 'Social media'],
    commonMistakes: [
      'Too extreme angle (over 60°) losing front design visibility',
      'Inconsistent angle between shots',
      'Too shallow DOF making edges soft',
      'Poor lighting on the turned side'
    ]
  },

  'side': {
    angle: 'side',
    lensType: 'Standard',
    focalLength: '70-85mm',
    aperture: 'f/5.6-f/8',
    sensorDistance: '7-9 feet',
    fieldOfView: 'Normal (40-45°)',
    depthOfField: 'Deep - full profile in focus',
    perspective: 'Profile view, linear',
    technicalDescription: 'Pure side profile using 70-85mm lens at f/5.6-f/8, positioned perpendicular to subject at 7-9 feet, capturing exact profile',
    promptAddition: `**CAMERA/ANGLE: Side View.** The model is posed in a perfect side profile relative to the camera. **VERIFICATION:** The model's shoulder, hip, and ear are aligned vertically; only one side of the face is visible. This angle showcases the garment's silhouette and side seam. The framing is a Medium Shot, cropped from head to below the waist. Lens: 85mm at f/8.`,
    bestFor: ['Fit demonstration', 'Silhouette showcase', 'Technical documentation', 'Size guides'],
    commonMistakes: [
      'Not perfectly perpendicular (cheating toward front)',
      'Camera too low or too high',
      'Design on chest completely hidden',
      'Awkward arm position breaking silhouette'
    ]
  },

  'closeup': {
    angle: 'closeup',
    lensType: 'Macro/Portrait',
    focalLength: '90-105mm macro',
    aperture: 'f/8-f/11',
    sensorDistance: '3-4 feet',
    fieldOfView: 'Narrow (25-35°)',
    depthOfField: 'Moderate - focus on specific area',
    perspective: 'Intimate, detail-focused',
    technicalDescription: 'Close-up detail shot using 90-105mm macro lens at f/8-f/11, positioned 3-4 feet from subject, focusing on design and fabric texture',
    promptAddition: `**CAMERA/ANGLE: Closeup.** This is a tight chest shot, focusing on the design and fabric. **VERIFICATION:** The frame is cropped from just below the chin to the mid-torso. The model's face may be partially or fully out of frame to prioritize the design. This shot must clearly show fabric weave, print texture, and how the design sits on the material. Lens: 105mm Macro at f/11.`,
    bestFor: ['Quality demonstration', 'Fabric texture showcase', 'Print detail', 'Material verification'],
    commonMistakes: [
      'Too shallow DOF making edges unusable',
      'Camera too close causing unnatural macro look',
      'Focus on wrong area (face instead of design)',
      'Losing context of garment completely'
    ]
  },

  'size-chart': {
    angle: 'size-chart',
    lensType: 'Standard Wide',
    focalLength: '35-50mm',
    aperture: 'f/8-f/11',
    sensorDistance: '10-12 feet',
    fieldOfView: 'Normal to Slightly Wide (55-65°)',
    depthOfField: 'Very Deep - entire figure sharp',
    perspective: 'Slightly elevated, documentary',
    technicalDescription: 'Full-body documentation shot using 35-50mm lens at f/8-f/11, positioned 10-12 feet from subject at slight elevation, capturing complete garment',
    promptAddition: `Shot with a 35-50mm standard lens from 10-12 feet away, camera positioned at a slight elevation (about 1-2 feet above chest level) to capture the full body. The camera is centered and straight-on, similar to front view but pulled back to show the complete garment from head to below waist. Aperture is f/8-f/11 for maximum depth of field, ensuring every part of the garment is in sharp focus. This perspective is documentary-style, showing accurate proportions and full garment length. The slight elevation prevents perspective distortion of the lower body. The frame includes the entire torso plus context, allowing viewers to see overall fit, garment length, and proportions. This is a technical reference shot, not artistic - clarity and accuracy are priorities.`,
    bestFor: ['Size charts', 'Fit guides', 'Length demonstration', 'Technical specifications'],
    commonMistakes: [
      'Camera too low causing foreshortening',
      'Too wide angle causing distortion at edges',
      'Cutting off important reference points',
      'Uneven perspective making measurements unclear'
    ]
  }
};

export function getCameraSpecsForAngle(angle: MockupAngle): CameraSpec {
  return CAMERA_SPECS[angle];
}
