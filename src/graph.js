/**
 * Fetches and logs a table showing which groups are in other groups.
 * The table has group names in the header row and member names in the first column.
 * An "X" marks if a member belongs to a group.
 * @param {string} accessToken - The access token for MS Graph API.
 */
export async function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers,
    };

    try {
        // Step 1: Fetch groups starting with "grp_"
        const groupsResponse = await fetch(graphConfig.groupsEndpoint, options);
        if (!groupsResponse.ok) {
            throw new Error(`Error fetching groups: ${groupsResponse.statusText}`);
        }
        const groups = await groupsResponse.json();

        // Filter groups matching the specific naming pattern
        const filteredGroups = groups.value.filter(group => /^grp_\d{2}_/.test(group.displayName));
        // const filteredGroups = groups.value

        const groupMembership = new Map(); // Map to store group memberships
        const allMembers = new Set(); // Set to store all unique members

        // Step 2: Fetch members for each group
        for (const group of filteredGroups) {
            const groupName = group.displayName;
            groupMembership.set(groupName, new Set());

            const membersResponse = await fetch(`${graphConfig.membersEndpoint}/${group.id}/members`, options);
            if (!membersResponse.ok) {
                console.error(`Error fetching members for group ${groupName}: ${membersResponse.statusText}`);
                continue;
            }
            const members = await membersResponse.json();

            // Process members
            for (const member of members.value) {
                const memberName = member.displayName || "Unknown Member";
                allMembers.add(memberName);
                groupMembership.get(groupName).add(memberName);
            }
        }

        // Step 3: Create the table
        const groupNames = Array.from(groupMembership.keys());
        const memberNames = Array.from(allMembers);

        // Table Header
        const table = [["Members", ...groupNames]];

        // Fill table rows
        memberNames.forEach(memberName => {
            const row = [memberName];
            groupNames.forEach(groupName => {
                row.push(groupMembership.get(groupName).has(memberName) ? "X" : "");
            });
            table.push(row);
        });

        // Step 4: Log the table
        console.log(table.map(row => row.join("\t")).join("\n"));

        // Return table for further use
        return table;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

const graphConfig = {
    groupsEndpoint: "https://graph.microsoft.com/v1.0/groups?$filter=startswith(displayName,'grp_')",
    membersEndpoint: "https://graph.microsoft.com/v1.0/groups",
};
