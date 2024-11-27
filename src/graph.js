
/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */
export async function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    try {
        // Step 1: Fetch groups starting with "grp"
        const groupsResponse = await fetch(graphConfig.groupsEndpoint, options);
        if (!groupsResponse.ok) {
            throw new Error(`Error fetching groups: ${groupsResponse.statusText}`);
        }
        const groups = await groupsResponse.json();

        const filteredGroups = groups.value.filter(group => {
            const pattern = /^grp_\d{2}_/; // Pattern: starts with "grp_", two digits, and then "_"
            return pattern.test(group.displayName);
        });

        // Step 2: Fetch members for each group
        for (const group of filteredGroups) {
            console.log(`Group: ${group.displayName}`);

            const membersResponse = await fetch(`${graphConfig.membersEndpoint}/${group.id}/members`, options);
            if (!membersResponse.ok) {
                console.error(`Error fetching members for group ${group.displayName}: ${membersResponse.statusText}`);
                continue;
            }
            const members = await membersResponse.json();

            console.log(`Members of ${group.displayName}:`);
            for (const member of members.value) {
                console.log(`- ${member.displayName} (${member.mail || "No email"})`);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

const graphConfig = {
    groupsEndpoint: "https://graph.microsoft.com/v1.0/groups?$filter=startswith(displayName,'grp_')",
    membersEndpoint: "https://graph.microsoft.com/v1.0/groups"
};

