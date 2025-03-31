import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ServiceData, ServiceDataWithPosition } from 'types/networkDashboard';
import { fetchServices } from 'services/api';

interface NetworkGraphProps {
  className?: string;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const width = 800;
  const height = 800;
  const margin = 20;
  const innerRadius = 80;
  const outerRadius = (Math.min(width, height) / 2) - margin;
  
  const minCircleSize = 5;
  const maxCircleSize = 30;

  const loadServices = async () => {
    try {
      const servicesData = await fetchServices();
      setServices(servicesData);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Failed to load service data');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();

    const intervalId = setInterval(() => {
      loadServices();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!svgRef.current || loading) return;

    const svg = d3.select(svgRef.current);


    svg.selectAll('*').remove();

    // Create the main group element
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create a radial scale
    const radialScale = d3.scaleLinear()
      .domain([0, 1]) // importance_score range
      .range([innerRadius, outerRadius]);

    // Create the concentric circles (0%, 25%, 50%, etc.)
    const circles = [0.05, 0.25, 0.50, 0.75];
    circles.forEach(circle => {
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radialScale(circle))
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke-width', 1);
    });

    // Add percentage labels
    g.append("text")
      .attr("x", 0)
      .attr("y", -innerRadius + 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "white")
      .text("05%");

    g.append("text")
      .attr("x", 0)
      .attr("y", -radialScale(0.25) + 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "white")
      .text("25%");

    g.append("text")
      .attr("x", 0)
      .attr("y", -radialScale(0.5) + 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "white")
      .text("50%");

    // Add a 50% red circle emphasis 
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radialScale(0.5))
      .attr('fill', 'none')
      .attr('stroke', 'rgba(239, 68, 68, 0.4)')
      .attr('stroke-width', 2);

    // Add domain quadrants
    const domains = [
      { id: "I", angle: Math.PI / 4, color: "#60A5FA" },      // Blue
      { id: "II", angle: 3 * Math.PI / 4, color: "#34D399" }, // Green
      { id: "III", angle: 5 * Math.PI / 4, color: "#818CF8" },// Indigo
      { id: "IV", angle: 7 * Math.PI / 4, color: "#C084FC" }  // Purple
    ];

    // Create pie sections for quadrants with very low opacity
    const pie = d3.pie()
      .value(() => 1)
      .padAngle(0.02)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    g.selectAll("path")
      .data(pie([1, 1, 1, 1]))
      .enter()
      .append("path")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("d", arc as any)
      .attr("fill", (_d, i) => {
        // Create very subtle background coloring for each quadrant
        if (i === 0) return "rgba(37, 99, 235, 0.03)"; // I - Blue
        if (i === 1) return "rgba(5, 150, 105, 0.03)"; // II - Green
        if (i === 2) return "rgba(79, 70, 229, 0.03)"; // III - Indigo
        return "rgba(126, 34, 206, 0.03)";            // IV - Purple
      });

    // Add domain identifiers at the edges
    domains.forEach(domain => {
      const x = Math.cos(domain.angle) * (outerRadius + 25);
      const y = Math.sin(domain.angle) * (outerRadius + 25);
      
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 18)
        .attr('fill', 'rgba(0, 0, 0, 0.3)')
        .attr('stroke', domain.color)
        .attr('stroke-width', 2);
      
      g.append('text')
        .attr('x', x)
        .attr('cy', y)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', domain.color)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(domain.id);
    });

    // Function to determine domain quadrant from domain_id
    const getDomainQuadrant = (domainId: string) => {
      switch(domainId) {
        case "enterprise-1": return { start: -Math.PI/4, end: Math.PI/4, id: "I" };
        case "user-access-west": return { start: Math.PI/4, end: 3*Math.PI/4, id: "II" };
        case "infra-core": return { start: 3*Math.PI/4, end: 5*Math.PI/4, id: "III" };
        case "security-services": return { start: 5*Math.PI/4, end: 7*Math.PI/4, id: "IV" };
        default: return { start: 0, end: 2*Math.PI, id: "I" }; // Default to domain I
      }
    };

    // Generate random positions for nodes if we don't already have them
    // In a real application, these positions would be persisted
    const servicesWithPositions: ServiceDataWithPosition[] = services.map(service => {
      const serviceWithPosition = service as ServiceDataWithPosition;
      
      if (!serviceWithPosition._angle) {
        const quadrant = getDomainQuadrant(service.domain_id);
        // Generate random angle within the quadrant
        const angle = quadrant.start + Math.random() * (quadrant.end - quadrant.start);
        
        // Use importance_score for distance from center (reversed so higher importance is closer to center)
        // This matches the visual in the reference image
        const importanceModifier = service.status === 'Critical' ? 
          Math.min(0.55, service.importance_score) : service.importance_score;
          
        const radius = radialScale(importanceModifier);
        
        serviceWithPosition._angle = angle;
        serviceWithPosition._radius = radius;
        serviceWithPosition._x = Math.cos(angle) * radius;
        serviceWithPosition._y = Math.sin(angle) * radius;
        serviceWithPosition._quadrant = quadrant.id;
      }
      
      return serviceWithPosition;
    });

    // Size scale based on criticality or traffic
    const sizeScale = d3.scaleLinear()
      .domain([0, 1])  // normalized criticality or traffic value
      .range([minCircleSize, maxCircleSize]);

    // Add background scatter circles to create the effect seen in the image
    const backgroundPoints = 150;
    const backgroundData = Array(backgroundPoints).fill(0).map(() => {
      const angle = Math.random() * 2 * Math.PI;
      const radius = innerRadius + Math.random() * (outerRadius * 1.2 - innerRadius);
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: Math.random() * 8 + 3
      };
    });

    g.selectAll(".background-circle")
      .data(backgroundData)
      .enter()
      .append("circle")
      .attr("class", "background-circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.size)
      .attr("fill", "rgba(255, 255, 255, 0.05)");

    // Draw service nodes
    g.selectAll(".service-node")
      .data(servicesWithPositions)
      .enter()
      .append("circle")
      .attr("class", "service-node")
      .attr("cx", d => d._x || 0) // Provide fallback value to avoid undefined
      .attr("cy", d => d._y || 0) // Provide fallback value to avoid undefined
      .attr("r", d => {
        // Scale node size by criticality score and status
        if (d.status === 'Critical') {
          return sizeScale(d.criticality_score * 0.8 + 0.2); // Make critical nodes larger
        } else if (d.status === 'Warning') {
          return sizeScale(d.criticality_score * 0.5 + 0.1);
        } else {
          return sizeScale(d.criticality_score * 0.3);
        }
      })
      .attr("fill", d => {
        // Color based on status
        if (d.status === 'Critical') return '#EF4444'; // Red
        if (d.status === 'Warning') return '#F59E0B'; // Amber/Yellow
        return '#9CA3AF'; // Gray for normal
      })
      .attr("stroke", d => {
        // Add a subtle stroke for better visibility
        if (d.status === 'Critical') return '#FEE2E2'; // Light red
        if (d.status === 'Warning') return '#FEF3C7'; // Light yellow
        return 'rgba(255, 255, 255, 0.2)'; // Transparent white for normal
      })
      .attr("stroke-width", 1)
      .attr("opacity", 0.9);

    // Add min/max legend at the bottom
    const legendGroup = svg.append("g")
      .attr("transform", `translate(50, ${height - 40})`);
      
    // Min circle
    legendGroup.append("circle")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 4)
      .attr("fill", "rgba(255, 255, 255, 0.3)");
      
    legendGroup.append("text")
      .attr("x", 20)
      .attr("y", 14)
      .attr("fill", "rgba(255, 255, 255, 0.7)")
      .attr("font-size", "12px")
      .text("Min - 1K");
      
    // Max circle  
    legendGroup.append("circle")
      .attr("cx", 100)
      .attr("cy", 10)
      .attr("r", 10)
      .attr("fill", "rgba(255, 255, 255, 0.3)");
      
    legendGroup.append("text")
      .attr("x", 120)
      .attr("y", 14)
      .attr("fill", "rgba(255, 255, 255, 0.7)")
      .attr("font-size", "12px")
      .text("Max - 10K");

    // Add status legend at the top left
    const statusLegend = svg.append("g")
      .attr("transform", `translate(50, 50)`);
      
    // Normal status
    statusLegend.append("circle")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 5)
      .attr("fill", "#9CA3AF");
      
    statusLegend.append("text")
      .attr("x", 25)
      .attr("y", 14)
      .attr("fill", "white")
      .attr("font-size", "14px")
      .text("Normal");
      
    // Warning status  
    statusLegend.append("circle")
      .attr("cx", 10)
      .attr("cy", 40)
      .attr("r", 5)
      .attr("fill", "#F59E0B");
      
    statusLegend.append("text")
      .attr("x", 25)
      .attr("y", 44)
      .attr("fill", "white")
      .attr("font-size", "14px")
      .text("Warning");
      
    // Critical status
    statusLegend.append("circle")
      .attr("cx", 10)
      .attr("cy", 70)
      .attr("r", 5)
      .attr("fill", "#EF4444");
      
    statusLegend.append("text")
      .attr("x", 25)
      .attr("y", 74)
      .attr("fill", "white")
      .attr("font-size", "14px")
      .text("Critical");

  }, [services, loading, outerRadius]);

  return (
    <div className={`bg-black h-full w-full ${className}`}>
      {loading && !services.length ? (
        <div className="flex justify-center items-center h-full text-gray-400">
          Loading network data...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full text-red-500">
          {error}
        </div>
      ) : (
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        />
      )}
    </div>
  );
};

export default NetworkGraph;