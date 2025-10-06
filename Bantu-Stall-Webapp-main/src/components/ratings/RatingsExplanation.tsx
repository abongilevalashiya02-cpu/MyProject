
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const RatingsExplanation = () => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5">Symbol</TableHead>
            <TableHead className="w-1/5">Rating Type</TableHead>
            <TableHead>What It Means</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">⭐</TableCell>
            <TableCell>Luxury Rating</TableCell>
            <TableCell>Higher numbers indicate a more premium experience with finer amenities and services.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">💰</TableCell>
            <TableCell>Budget-Friendly</TableCell>
            <TableCell>Higher numbers indicate better value for money, with 5 being the most affordable option.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">🍃</TableCell>
            <TableCell>Eco-Friendly</TableCell>
            <TableCell>Measures the environmental impact and sustainability practices of the experience.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">🛡️</TableCell>
            <TableCell>Cultural Depth</TableCell>
            <TableCell>Indicates the authenticity and cultural immersion level of the experience.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">🛋️</TableCell>
            <TableCell>Comfort</TableCell>
            <TableCell>Rates the physical comfort level and convenience throughout the experience.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium">How to read the ratings:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Each symbol is followed by a number from 1-5</li>
          <li>Higher numbers typically indicate better ratings (5 being highest)</li>
          <li>Ratings help you choose experiences that match your priorities</li>
          <li>Our gigpreneurs strive to maximize all ratings for a balanced experience</li>
        </ul>
      </div>
    </div>
  );
};

export default RatingsExplanation;
