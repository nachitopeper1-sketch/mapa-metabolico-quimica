import { useState } from "react"
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Separator,
  Tabs,
  Icon,
  Container,
} from "@chakra-ui/react"
import { LuFlaskConical, LuAtom, LuArrowRight, LuInfo, LuCircleDot, LuZap, LuActivity } from "react-icons/lu"

interface Step {
  id: string
  from: string
  to: string
  enzyme: string
  desc: string
  reversible: boolean
  details: string
  cofactors?: string[]
}

interface PathwayData {
  title: string
  location: string
  colorScheme: string
  icon: React.ReactNode
  steps: Step[]
  netYield?: string
}

const metabolicData: Record<string, PathwayData> = {
  glucolisis: {
    title: "Glucólisis",
    location: "Citosol",
    colorScheme: "orange",
    icon: <LuZap />,
    netYield: "2 ATP + 2 NADH + 2 Piruvato",
    steps: [
      {
        id: "g1",
        from: "Glucosa",
        to: "Glucosa-6-P",
        enzyme: "Hexoquinasa / Glucoquinasa",
        desc: "Fosforilación de la glucosa para atraparla en la célula. Consume 1 ATP e impide que la glucosa salga de la célula.",
        reversible: false,
        cofactors: ["ATP → ADP", "Mg²⁺"],
        details: "Se añade un grupo fosfato en el carbono 6. La Glucoquinasa actúa en el hígado con alta Km.",
      },
      {
        id: "g2",
        from: "Glucosa-6-P",
        to: "Fructosa-6-P",
        enzyme: "Fosfoglucosa Isomerasa",
        desc: "Isomerización de una aldosa (G6P) a una cetosa (F6P). Reordenamiento intramolecular.",
        reversible: true,
        cofactors: [],
        details: "Preparación del sustrato para la segunda fosforilación. Equilibrio favorecido hacia G6P.",
      },
      {
        id: "g3",
        from: "Fructosa-6-P",
        to: "Fructosa-1,6-BP",
        enzyme: "Fosfofructoquinasa-1 (PFK-1)",
        desc: "Punto de control principal de la glucólisis. Paso comprometido e irreversible. Consume 1 ATP.",
        reversible: false,
        cofactors: ["ATP → ADP", "Mg²⁺"],
        details: "Regulada alostéricamente: inhibida por ATP, citrato; activada por AMP, ADP, Fructosa-2,6-BP.",
      },
      {
        id: "g4",
        from: "Fructosa-1,6-BP",
        to: "DHAP + G3P",
        enzyme: "Aldolasa",
        desc: "Ruptura de la cadena de 6 carbonos en dos fragmentos de 3 carbonos.",
        reversible: true,
        cofactors: [],
        details: "La DHAP se isomeriza rápidamente a G3P por la triosafosfato isomerasa.",
      },
      {
        id: "g5",
        from: "G3P",
        to: "1,3-Bisfosfoglicerato",
        enzyme: "G3P Deshidrogenasa",
        desc: "Oxidación acoplada a fosforilación. Genera NADH y un acil-fosfato de alta energía.",
        reversible: true,
        cofactors: ["NAD⁺ → NADH", "Pᵢ"],
        details: "El acil-fosfato creado tiene un alto potencial de transferencia de fosfato.",
      },
      {
        id: "g9",
        from: "2-Fosfoglicerato",
        to: "Fosfoenolpiruvato",
        enzyme: "Enolasa",
        desc: "Deshidratación que genera el fosfoenolpiruvato (PEP), compuesto de muy alta energía.",
        reversible: true,
        cofactors: ["Mg²⁺"],
        details: "PEP tiene el mayor potencial de transferencia de grupo fosfato de la glucólisis.",
      },
      {
        id: "g10",
        from: "Fosfoenolpiruvato",
        to: "Piruvato",
        enzyme: "Piruvato Quinasa",
        desc: "Segunda fosforilación a nivel de sustrato. Genera 2 ATP por molécula de glucosa. Paso final.",
        reversible: false,
        cofactors: ["ADP → ATP", "K⁺", "Mg²⁺"],
        details: "Regulada por F1,6BP (activador), ATP y alanina (inhibidores). Irreversible en condiciones fisiológicas.",
      },
    ],
  },
  krebs: {
    title: "Ciclo de Krebs",
    location: "Matriz Mitocondrial",
    colorScheme: "teal",
    icon: <LuActivity />,
    netYield: "3 NADH + 1 FADH₂ + 1 GTP + 2 CO₂",
    steps: [
      {
        id: "k0",
        from: "Piruvato",
        to: "Acetil-CoA",
        enzyme: "Piruvato Deshidrogenasa (PDH)",
        desc: "Descarboxilación oxidativa del piruvato. Enlace irreversible entre glucólisis y ciclo de Krebs.",
        reversible: false,
        cofactors: ["NAD⁺ → NADH", "CoA", "CO₂"],
        details: "Complejo multienzimático con 3 enzimas y 5 cofactores. Regulado por NADH, Acetil-CoA.",
      },
      {
        id: "k1",
        from: "Oxalacetato + Acetil-CoA",
        to: "Citrato",
        enzyme: "Citrato Sintasa",
        desc: "Condensación del acetil de 2 carbonos con oxalacetato de 4 carbonos para formar citrato de 6 carbonos.",
        reversible: false,
        cofactors: ["H₂O"],
        details: "Inhibida por NADH, succinil-CoA, ATP y ácidos grasos acil-CoA de cadena larga.",
      },
      {
        id: "k2",
        from: "Citrato",
        to: "Isocitrato",
        enzyme: "Aconitasa",
        desc: "Isomerización del citrato a isocitrato mediante deshidratación-rehidratación.",
        reversible: true,
        cofactors: ["Fe-S"],
        details: "La aconitasa contiene un centro hierro-azufre. Isómero trans del citrato.",
      },
      {
        id: "k3",
        from: "Isocitrato",
        to: "α-Cetoglutarato",
        enzyme: "Isocitrato Deshidrogenasa",
        desc: "Primera descarboxilación oxidativa del ciclo. Genera NADH y libera CO₂. Paso regulador.",
        reversible: false,
        cofactors: ["NAD⁺ → NADH", "CO₂", "Mn²⁺"],
        details: "Enzima alostérica: activada por ADP e isocitrato; inhibida por NADH y ATP.",
      },
      {
        id: "k4",
        from: "α-Cetoglutarato",
        to: "Succinil-CoA",
        enzyme: "α-Cetoglutarato Deshidrogenasa",
        desc: "Segunda descarboxilación oxidativa. Genera NADH y CO₂.",
        reversible: false,
        cofactors: ["NAD⁺ → NADH", "CoA", "CO₂"],
        details: "Complejo similar a PDH con 3 enzimas. Inhibido por NADH y succinil-CoA.",
      },
      {
        id: "k5",
        from: "Succinil-CoA",
        to: "Succinato",
        enzyme: "Succinil-CoA Sintetasa",
        desc: "Fosforilación a nivel de sustrato. Genera directamente 1 GTP (o ATP) por vuelta del ciclo.",
        reversible: true,
        cofactors: ["GDP + Pᵢ → GTP", "CoA"],
        details: "Única reacción del ciclo que genera directamente un nucleósido trifosfato.",
      },
      {
        id: "k6",
        from: "Succinato",
        to: "Fumarato",
        enzyme: "Succinato Deshidrogenasa",
        desc: "Oxidación del succinato a fumarato. Genera FADH₂. Única enzima del ciclo unida a la membrana.",
        reversible: true,
        cofactors: ["FAD → FADH₂"],
        details: "Forma parte del Complejo II de la cadena respiratoria mitocondrial.",
      },
      {
        id: "k7",
        from: "Fumarato",
        to: "Malato",
        enzyme: "Fumarasa",
        desc: "Hidratación del fumarato a L-Malato. Reacción estereoespecífica.",
        reversible: true,
        cofactors: ["H₂O"],
        details: "Solo produce el L-malato, no el D-malato. Alta especificidad estereoquímica.",
      },
      {
        id: "k8",
        from: "Malato",
        to: "Oxalacetato",
        enzyme: "Malato Deshidrogenasa",
        desc: "Regeneración del oxalacetato aceptor para reiniciar el ciclo. Genera el tercer NADH.",
        reversible: true,
        cofactors: ["NAD⁺ → NADH"],
        details: "El equilibrio favorece el malato, pero el ciclo continúa por el consumo de oxalacetato.",
      },
    ],
  },
}

export default function App() {
  const [selectedStep, setSelectedStep] = useState<Step | null>(null)
  const [activeTab, setActiveTab] = useState("glucolisis")

  const currentData = metabolicData[activeTab]
  const accent = currentData.colorScheme

  return (
    <Box bg="bg" minH="100vh">
      {/* Header */}
      <Box
        bg="bg.panel"
        borderBottomWidth="1px"
        borderColor="border"
        py={{ base: "6", md: "8" }}
        px={{ base: "4", md: "8" }}
      >
        <Container maxW="6xl">
          <HStack gap="3">
            <Box p="2.5" bg="orange.100" _dark={{ bg: "orange.950" }} rounded="lg">
              <Icon color="orange.600" _dark={{ color: "orange.300" }} boxSize="6">
                <LuFlaskConical />
              </Icon>
            </Box>
            <Box>
              <Heading size="xl" fontWeight="bold" color="fg" letterSpacing="tight">
                Mapa Metabólico Interactivo
              </Heading>
              <Text textStyle="sm" color="fg.muted" mt="0.5">
                Vías bioquímicas principales — enzimas, cofactores y regulación
              </Text>
            </Box>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="6xl" py={{ base: "6", md: "8" }} px={{ base: "4", md: "8" }}>
        <Tabs.Root
          value={activeTab}
          onValueChange={(e) => { setActiveTab(e.value); setSelectedStep(null) }}
          variant="enclosed"
        >
          <Tabs.List mb="6">
            <Tabs.Trigger value="glucolisis">
              <Icon><LuZap /></Icon>
              Glucólisis
            </Tabs.Trigger>
            <Tabs.Trigger value="krebs">
              <Icon><LuActivity /></Icon>
              Ciclo de Krebs
            </Tabs.Trigger>
          </Tabs.List>

          {(["glucolisis", "krebs"] as const).map((tabKey) => {
            const data = metabolicData[tabKey]
            const tabAccent = data.colorScheme

            return (
              <Tabs.Content key={tabKey} value={tabKey}>
                <Grid
                  templateColumns={{ base: "1fr", lg: "1fr 340px" }}
                  gap="6"
                >
                  {/* Steps Column */}
                  <Box>
                    <HStack mb="5" flexWrap="wrap" gap="2">
                      <Badge colorPalette={tabAccent} variant="subtle" size="md">
                        <Icon><LuAtom /></Icon>
                        {data.location}
                      </Badge>
                      {data.netYield && (
                        <Badge colorPalette="gray" variant="surface" size="md">
                          Rendimiento neto: {data.netYield}
                        </Badge>
                      )}
                    </HStack>

                    <VStack gap="0" align="stretch">
                      {data.steps.map((step, index) => {
                        const isSelected = selectedStep?.id === step.id

                        return (
                          <Box key={step.id}>
                            <Box
                              onClick={() => setSelectedStep(isSelected ? null : step)}
                              cursor="pointer"
                              p="4"
                              rounded="xl"
                              borderWidth="1.5px"
                              borderColor={isSelected ? `${tabAccent}.400` : "border"}
                              bg={isSelected ? `${tabAccent}.50` : "bg.panel"}
                              _dark={{
                                bg: isSelected ? `${tabAccent}.950` : "bg.panel",
                                borderColor: isSelected ? `${tabAccent}.600` : "border",
                              }}
                              _hover={{
                                borderColor: `${tabAccent}.300`,
                                bg: isSelected ? `${tabAccent}.50` : "bg.subtle",
                                _dark: {
                                  bg: isSelected ? `${tabAccent}.950` : "bg.subtle",
                                },
                              }}
                              transition="all 0.15s ease"
                              shadow={isSelected ? "sm" : "none"}
                            >
                              <Flex justify="space-between" align="flex-start" mb="2" gap="2">
                                <HStack gap="2" minW="0">
                                  <Flex
                                    w="5"
                                    h="5"
                                    rounded="full"
                                    bg={`${tabAccent}.500`}
                                    align="center"
                                    justify="center"
                                    flexShrink={0}
                                  >
                                    <Text fontSize="10px" color="white" fontWeight="bold" lineHeight="1">
                                      {index + 1}
                                    </Text>
                                  </Flex>
                                  <Text
                                    textStyle="xs"
                                    color="fg.muted"
                                    fontWeight="medium"
                                    truncate
                                  >
                                    {step.enzyme}
                                  </Text>
                                </HStack>
                                <Badge
                                  size="xs"
                                  variant="subtle"
                                  colorPalette={step.reversible ? "blue" : "red"}
                                  flexShrink={0}
                                >
                                  {step.reversible ? "Reversible" : "Irreversible"}
                                </Badge>
                              </Flex>

                              <HStack gap="2" flexWrap="wrap">
                                <Text textStyle="sm" fontWeight="semibold" color="fg">
                                  {step.from}
                                </Text>
                                <Icon color={`${tabAccent}.500`} boxSize="3.5" flexShrink={0}>
                                  <LuArrowRight />
                                </Icon>
                                <Text textStyle="sm" fontWeight="semibold" color="fg">
                                  {step.to}
                                </Text>
                              </HStack>

                              {step.cofactors && step.cofactors.length > 0 && (
                                <HStack mt="2.5" gap="1.5" flexWrap="wrap">
                                  {step.cofactors.map((c) => (
                                    <Badge key={c} size="xs" variant="surface" colorPalette="gray">
                                      {c}
                                    </Badge>
                                  ))}
                                </HStack>
                              )}
                            </Box>

                            {index < data.steps.length - 1 && (
                              <Flex justify="center" py="1">
                                <Box w="0.5" h="5" bg="border" />
                              </Flex>
                            )}
                          </Box>
                        )
                      })}
                    </VStack>
                  </Box>

                  {/* Detail Panel */}
                  <Box>
                    <Box position={{ lg: "sticky" }} top="8">
                      <Box
                        bg="gray.900"
                        _dark={{ bg: "bg.panel", borderWidth: "1px", borderColor: "border" }}
                        rounded="2xl"
                        p="6"
                        color="white"
                        overflow="hidden"
                        position="relative"
                        minH="300px"
                      >
                        <Box
                          position="absolute"
                          right="-6"
                          top="-6"
                          opacity="0.05"
                          pointerEvents="none"
                        >
                          <Icon boxSize="36" color="white">
                            <LuFlaskConical />
                          </Icon>
                        </Box>

                        <HStack gap="2" mb="5">
                          <Icon color="orange.400" boxSize="4">
                            <LuInfo />
                          </Icon>
                          <Text fontWeight="bold" textStyle="sm" color="white" _dark={{ color: "fg" }}>
                            Detalle Enzimático
                          </Text>
                        </HStack>

                        {selectedStep ? (
                          <VStack align="stretch" gap="4">
                            <Box>
                              <Text
                                textStyle="2xs"
                                fontWeight="bold"
                                color="orange.400"
                                letterSpacing="wider"
                                textTransform="uppercase"
                                mb="1"
                              >
                                Reacción
                              </Text>
                              <Text textStyle="sm" fontWeight="semibold" color="white" _dark={{ color: "fg" }} lineHeight="tall">
                                {selectedStep.from} → {selectedStep.to}
                              </Text>
                            </Box>

                            <Separator borderColor="whiteAlpha.200" _dark={{ borderColor: "border" }} />

                            <Box>
                              <Text
                                textStyle="2xs"
                                fontWeight="bold"
                                color="orange.400"
                                letterSpacing="wider"
                                textTransform="uppercase"
                                mb="1"
                              >
                                Enzima
                              </Text>
                              <Text textStyle="sm" color="gray.200" _dark={{ color: "fg.muted" }}>
                                {selectedStep.enzyme}
                              </Text>
                            </Box>

                            {selectedStep.cofactors && selectedStep.cofactors.length > 0 && (
                              <Box>
                                <Text
                                  textStyle="2xs"
                                  fontWeight="bold"
                                  color="orange.400"
                                  letterSpacing="wider"
                                  textTransform="uppercase"
                                  mb="2"
                                >
                                  Cofactores
                                </Text>
                                <HStack gap="1.5" flexWrap="wrap">
                                  {selectedStep.cofactors.map((c) => (
                                    <Badge key={c} size="sm" variant="surface" colorPalette="orange">
                                      {c}
                                    </Badge>
                                  ))}
                                </HStack>
                              </Box>
                            )}

                            <Box>
                              <Text
                                textStyle="2xs"
                                fontWeight="bold"
                                color="orange.400"
                                letterSpacing="wider"
                                textTransform="uppercase"
                                mb="1"
                              >
                                Proceso
                              </Text>
                              <Text textStyle="sm" color="gray.300" _dark={{ color: "fg.muted" }} lineHeight="tall">
                                {selectedStep.desc}
                              </Text>
                            </Box>

                            <Box
                              bg="whiteAlpha.100"
                              _dark={{ bg: "bg.subtle" }}
                              p="3"
                              rounded="lg"
                              borderWidth="1px"
                              borderColor="whiteAlpha.200"
                              _darkBorder={{ borderColor: "border" }}
                            >
                              <Text
                                textStyle="2xs"
                                fontWeight="bold"
                                color="gray.400"
                                _dark={{ color: "fg.subtle" }}
                                letterSpacing="wider"
                                textTransform="uppercase"
                                mb="1"
                              >
                                Mecanismo
                              </Text>
                              <Text
                                textStyle="xs"
                                color="gray.400"
                                _dark={{ color: "fg.subtle" }}
                                lineHeight="tall"
                                fontStyle="italic"
                              >
                                {selectedStep.details}
                              </Text>
                            </Box>

                            <Badge
                              size="md"
                              variant="subtle"
                              colorPalette={selectedStep.reversible ? "blue" : "red"}
                              w="full"
                              justifyContent="center"
                              py="2"
                              rounded="full"
                            >
                              {selectedStep.reversible
                                ? "Reacción reversible"
                                : "Reacción irreversible"}
                            </Badge>
                          </VStack>
                        ) : (
                          <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            py="14"
                            gap="3"
                          >
                            <Icon boxSize="8" color="gray.600" _dark={{ color: "fg.subtle" }}>
                              <LuCircleDot />
                            </Icon>
                            <Text
                              textStyle="sm"
                              color="gray.500"
                              _dark={{ color: "fg.subtle" }}
                              textAlign="center"
                              maxW="44"
                            >
                              Selecciona un paso para ver los detalles enzimáticos
                            </Text>
                          </Flex>
                        )}
                      </Box>

                      {/* Legend */}
                      <Box
                        mt="4"
                        bg="bg.panel"
                        rounded="xl"
                        p="4"
                        borderWidth="1px"
                        borderColor="border"
                      >
                        <Text
                          textStyle="2xs"
                          fontWeight="bold"
                          color="fg.muted"
                          mb="3"
                          letterSpacing="wider"
                          textTransform="uppercase"
                        >
                          Simbología
                        </Text>
                        <VStack align="stretch" gap="2">
                          <HStack gap="2">
                            <Box w="2.5" h="2.5" rounded="full" bg="red.500" flexShrink={0} />
                            <Text textStyle="xs" color="fg.muted">
                              Irreversible — pasos reguladores clave
                            </Text>
                          </HStack>
                          <HStack gap="2">
                            <Box w="2.5" h="2.5" rounded="full" bg="blue.500" flexShrink={0} />
                            <Text textStyle="xs" color="fg.muted">
                              Reversible — equilibrio dinámico
                            </Text>
                          </HStack>
                          <HStack gap="2">
                            <Box w="2.5" h="2.5" rounded="full" bg="gray.400" flexShrink={0} />
                            <Text textStyle="xs" color="fg.muted">
                              Cofactores — moléculas auxiliares
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Tabs.Content>
            )
          })}
        </Tabs.Root>
      </Container>

      <Box borderTopWidth="1px" borderColor="border" py="6" mt="4">
        <Container maxW="6xl" px={{ base: "4", md: "8" }}>
          <Text textStyle="xs" color="fg.subtle" textAlign="center">
            Digitalización de Vías Metabólicas Principales — Bioquímica Celular
          </Text>
        </Container>
      </Box>
    </Box>
  )
}
