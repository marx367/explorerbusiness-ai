"use client";

import { useMemo } from "react";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { AutomationMap as Mapa, NodoFlujo } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui";

type TipoNodo = NodoFlujo["tipo"];

const ESTILO: Record<TipoNodo, string> = {
  fuente: "border-acento-3/50 text-acento-3",
  captura: "border-acento/50 text-acento",
  dato: "border-acento-2/50 text-acento-2",
  ia: "border-acento/70 bg-acento/10 text-acento",
  canal: "border-line text-texto",
  accion: "border-exito/40 text-exito",
  equipo: "border-alerta/40 text-alerta",
};

function Nodo({ data }: NodeProps) {
  const d = data as { etiqueta: string; tipo: TipoNodo };
  return (
    <div
      className={`relative w-[240px] rounded-xl border bg-surface px-4 py-3 text-center text-sm font-medium shadow-lg ${ESTILO[d.tipo]}`}
    >
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !border-none !bg-line" />
      {d.tipo === "ia" && (
        <span className="anim-glow absolute -inset-1 -z-10 rounded-2xl bg-acento/20 blur-md" />
      )}
      {d.etiqueta}
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !border-none !bg-line" />
    </div>
  );
}

const nodeTypes = { flujo: Nodo };

export function AutomationMap({ mapa }: { mapa: Mapa }) {
  const { nodos, aristas } = useMemo(() => {
    const nodos: Node[] = mapa.nodos.map((n, i) => ({
      id: n.id,
      type: "flujo",
      position: { x: -120, y: i * 100 },
      data: { etiqueta: n.etiqueta, tipo: n.tipo },
    }));
    const aristas: Edge[] = mapa.conexiones.map((c, i) => ({
      id: `e-${i}`,
      source: c.de,
      target: c.a,
      type: "smoothstep",
      animated: true,
      style: { stroke: "var(--color-line)", strokeWidth: 1.6 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "var(--color-acento)",
        width: 18,
        height: 18,
      },
    }));
    return { nodos, aristas };
  }, [mapa]);

  return (
    <section>
      <SectionTitle
        kicker="Visión del futuro"
        titulo="Automation Map"
        sub="Cómo podría funcionar el negocio después de implementar las automatizaciones."
      />
      <Card className="overflow-hidden p-0">
        <div className="h-[560px] w-full">
          <ReactFlow
            nodes={nodos}
            edges={aristas}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.28 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="var(--color-line)" gap={22} />
            <Controls />
          </ReactFlow>
        </div>
      </Card>
    </section>
  );
}
